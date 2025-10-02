// Simple WebSocket-like functionality using localStorage and polling for demo
// In production, you'd use Socket.io or similar real-time service

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
}

type EventCallback = (data: GameRoom) => void;

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

  createRoom(roomCode: string): GameRoom {
    const room: GameRoom = {
      id: roomCode,
      players: [],
      puzzleMaster: 0,
      secretWord: '',
      clue: '',
      phase: 'setup',
      currentPlayerIndex: 0,
      guesses: [],
      quitPlayers: [],
      winner: null,
      createdAt: Date.now()
    };

    localStorage.setItem(`room_${roomCode}`, JSON.stringify(room));
    this.roomId = roomCode;
    this.startPolling();
    return room;
  }

  joinRoom(roomCode: string): GameRoom | null {
    const roomData = localStorage.getItem(`room_${roomCode}`);
    if (!roomData) return null;

    const room: GameRoom = JSON.parse(roomData);
    this.roomId = roomCode;
    this.startPolling();
    return room;
  }

  updateRoom(updates: Partial<GameRoom>): void {
    if (!this.roomId) return;

    const roomData = localStorage.getItem(`room_${this.roomId}`);
    if (!roomData) return;

    const room: GameRoom = JSON.parse(roomData);
    const updatedRoom = { ...room, ...updates };
    localStorage.setItem(`room_${this.roomId}`, JSON.stringify(updatedRoom));
    
    this.emit('roomUpdate', updatedRoom);
  }

  getCurrentRoom(): GameRoom | null {
    if (!this.roomId) return null;
    
    const roomData = localStorage.getItem(`room_${this.roomId}`);
    return roomData ? JSON.parse(roomData) : null;
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

  private emit(event: string, data: GameRoom): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  private startPolling(): void {
    if (this.pollInterval) return;

    this.pollInterval = setInterval(() => {
      const room = this.getCurrentRoom();
      if (room) {
        this.emit('roomUpdate', room);
      }
    }, 1000);
  }

  disconnect(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.roomId = null;
  }

  getShareableLink(roomCode: string): string {
    return `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
  }
}

export const gameSocket = new GameSocket();