// Simple room management using sessionStorage and a global registry
// This demo version works within the same browser session

export interface GameRoom {
  id: string;
  players: string[];
  puzzleMaster: number;
  secretWord: string;
  clue: string;
  phase: 'setup' | 'wordInput' | 'puzzleCreation' | 'guessing' | 'results';
  currentPlayerIndex: number;
  guesses: Array<{player: string, guess: string, correct: boolean}>;
  quitPlayers: number[];
  winner: string | null;
  createdAt: number;
  maxPlayers?: number;
}

type EventCallback = (data: GameRoom) => void;

// Global room registry that persists across component instances
const GLOBAL_ROOMS: Map<string, GameRoom> = new Map();

export class GameSocket {
  private roomId: string | null = null;
  private playerId: string;
  private listeners: Map<string, EventCallback[]> = new Map();
  private pollInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.playerId = this.generatePlayerId();
  }

  private generatePlayerId(): string {
    return 'player_' + Math.random().toString(36).substr(2, 9);
  }

  generateRoomCode(): string {
    return 'GAME-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  createRoom(playerName: string): GameRoom {
    const roomCode = this.generateRoomCode();
    const room: GameRoom = {
      id: roomCode,
      players: [playerName],
      puzzleMaster: 0,
      secretWord: '',
      clue: '',
      phase: 'setup',
      currentPlayerIndex: 0,
      guesses: [],
      quitPlayers: [],
      winner: null,
      createdAt: Date.now(),
      maxPlayers: 4
    };

    // Store in global registry
    GLOBAL_ROOMS.set(roomCode, room);
    
    // Also store in localStorage for persistence
    localStorage.setItem(`room_${roomCode}`, JSON.stringify(room));
    localStorage.setItem('all_rooms', JSON.stringify(Array.from(GLOBAL_ROOMS.entries())));
    
    this.roomId = roomCode;
    this.startPolling();
    
    console.log('Room created:', room);
    console.log('All rooms in memory:', Array.from(GLOBAL_ROOMS.keys()));
    
    return room;
  }

  joinRoom(roomCode: string, playerName: string): GameRoom {
    console.log(`Attempting to join room: ${roomCode} with player: ${playerName}`);
    console.log('Available rooms:', Array.from(GLOBAL_ROOMS.keys()));
    
    // First check global registry
    let room = GLOBAL_ROOMS.get(roomCode);
    
    // If not in memory, try to load from localStorage
    if (!room) {
      try {
        const allRoomsData = localStorage.getItem('all_rooms');
        if (allRoomsData) {
          const allRooms = JSON.parse(allRoomsData);
          for (const [key, roomData] of allRooms) {
            GLOBAL_ROOMS.set(key, roomData);
          }
          room = GLOBAL_ROOMS.get(roomCode);
        }
      } catch (error) {
        console.error('Error loading rooms from localStorage:', error);
      }
    }
    
    // Last resort: try direct localStorage access
    if (!room) {
      const roomData = localStorage.getItem(`room_${roomCode}`);
      if (roomData) {
        room = JSON.parse(roomData);
        if (room) {
          GLOBAL_ROOMS.set(roomCode, room);
        }
      }
    }
    
    if (!room) {
      console.error(`Room ${roomCode} not found anywhere`);
      throw new Error(`Room ${roomCode} not found. Please check the room code.`);
    }

    console.log('Found room:', room);
    
    // Check if room is full
    if (room.players.length >= (room.maxPlayers || 4)) {
      throw new Error('Room is full. Cannot join.');
    }
    
    // Add player if not already in room
    if (!room.players.includes(playerName)) {
      room.players.push(playerName);
      console.log(`Added player ${playerName} to room. New players:`, room.players);
      
      // Update in all storage locations
      GLOBAL_ROOMS.set(roomCode, room);
      localStorage.setItem(`room_${roomCode}`, JSON.stringify(room));
      localStorage.setItem('all_rooms', JSON.stringify(Array.from(GLOBAL_ROOMS.entries())));
      
      // Notify room update
      this.emit('roomUpdate', room);
    } else {
      console.log(`Player ${playerName} already in room`);
    }
    
    this.roomId = roomCode;
    this.startPolling();
    return room;
  }

  updateRoom(updates: Partial<GameRoom>): void {
    if (!this.roomId) return;

    const room = GLOBAL_ROOMS.get(this.roomId);
    if (!room) return;

    const updatedRoom = { ...room, ...updates };
    
    // Update in all storage locations
    GLOBAL_ROOMS.set(this.roomId, updatedRoom);
    localStorage.setItem(`room_${this.roomId}`, JSON.stringify(updatedRoom));
    localStorage.setItem('all_rooms', JSON.stringify(Array.from(GLOBAL_ROOMS.entries())));
    
    this.emit('roomUpdate', updatedRoom);
  }

  getCurrentRoom(): GameRoom | null {
    if (!this.roomId) return null;
    return GLOBAL_ROOMS.get(this.roomId) || null;
  }

  addPlayer(playerName: string): void {
    if (!this.roomId) return;

    const room = this.getCurrentRoom();
    if (!room) return;

    if (!room.players.includes(playerName)) {
      room.players.push(playerName);
      this.updateRoom(room);
    }
  }

  removePlayer(playerName: string): void {
    if (!this.roomId) return;

    const room = this.getCurrentRoom();
    if (!room) return;

    room.players = room.players.filter(p => p !== playerName);
    this.updateRoom(room);
  }

  leaveRoom(roomId: string, playerName: string): void {
    const room = GLOBAL_ROOMS.get(roomId);
    if (!room) return;

    room.players = room.players.filter(p => p !== playerName);
    
    if (room.players.length === 0) {
      // Delete empty room
      GLOBAL_ROOMS.delete(roomId);
      localStorage.removeItem(`room_${roomId}`);
      localStorage.setItem('all_rooms', JSON.stringify(Array.from(GLOBAL_ROOMS.entries())));
    } else {
      // Update room
      GLOBAL_ROOMS.set(roomId, room);
      localStorage.setItem(`room_${roomId}`, JSON.stringify(room));
      localStorage.setItem('all_rooms', JSON.stringify(Array.from(GLOBAL_ROOMS.entries())));
      
      this.emit('roomUpdate', room);
    }
  }

  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  onRoomUpdate(callback: EventCallback): void {
    this.on('roomUpdate', callback);
  }

  offRoomUpdate(callback?: EventCallback): void {
    if (callback) {
      this.off('roomUpdate', callback);
    } else {
      this.listeners.delete('roomUpdate');
    }
  }

  private emit(event: string, data: GameRoom): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in callback:', error);
        }
      });
    }
  }

  private startPolling(): void {
    if (this.pollInterval) return;

    this.pollInterval = setInterval(() => {
      const room = this.getCurrentRoom();
      if (room) {
        this.emit('roomUpdate', room);
      }
    }, 2000);
  }

  disconnect(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.listeners.clear();
    this.roomId = null;
  }

  getShareableLink(roomCode: string): string {
    return `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
  }

  // Debug method
  listAllRooms(): string[] {
    return Array.from(GLOBAL_ROOMS.keys());
  }
}

// Export both for compatibility
export const gameSocket = new GameSocket();
export const socketManager = gameSocket; // Alias for backward compatibility