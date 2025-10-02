import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Copy, LogOut, Play } from 'lucide-react';
import { GameRoom, socketManager } from '@/lib/socket';
import { toast } from 'sonner';

interface OnlineGameLobbyProps {
  room: GameRoom;
  currentPlayer: string;
  onStartGame: (players: string[], puzzleMaster: number) => void;
  onLeaveRoom: () => void;
}

export default function OnlineGameLobby({ 
  room: initialRoom, 
  currentPlayer, 
  onStartGame, 
  onLeaveRoom 
}: OnlineGameLobbyProps) {
  const [room, setRoom] = useState<GameRoom>(initialRoom);

  useEffect(() => {
    // Set up room update listener with proper error handling
    const handleRoomUpdate = (updatedRoom: GameRoom) => {
      if (updatedRoom && updatedRoom.id === room.id) {
        setRoom(updatedRoom);
      }
    };

    // Check if socketManager has the onRoomUpdate method
    if (socketManager && typeof socketManager.onRoomUpdate === 'function') {
      socketManager.onRoomUpdate(handleRoomUpdate);
    }

    return () => {
      // Clean up listener with proper error handling
      if (socketManager && typeof socketManager.offRoomUpdate === 'function') {
        socketManager.offRoomUpdate();
      }
    };
  }, [room.id]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.id);
    toast.success('Room code copied to clipboard!');
  };

  const handleLeaveRoom = () => {
    if (socketManager && typeof socketManager.leaveRoom === 'function') {
      socketManager.leaveRoom(room.id, currentPlayer);
    }
    onLeaveRoom();
  };

  const handleStartGame = () => {
    if (room.players.length >= 2) {
      const randomMaster = Math.floor(Math.random() * room.players.length);
      onStartGame(room.players, randomMaster);
    }
  };

  const canStartGame = room.players.length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Game Lobby</CardTitle>
          <CardDescription className="text-gray-600">
            Waiting for players to join...
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Room Info */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-600">Room Code:</span>
              <Badge variant="outline" className="text-lg font-mono px-3 py-1">
                {room.id}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyRoomCode}
                className="p-1 h-8 w-8"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">
              Share this code with friends to join
            </p>
          </div>

          {/* Players List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Players ({room.players.length}/{room.maxPlayers})
            </h3>
            
            <div className="space-y-2">
              {room.players.map((player, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    player === currentPlayer
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="font-medium text-gray-800">{player}</span>
                  {player === currentPlayer && (
                    <Badge className="bg-blue-600">You</Badge>
                  )}
                </div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: room.maxPlayers - room.players.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="flex items-center p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/50"
                >
                  <span className="text-gray-400 italic">Waiting for player...</span>
                </div>
              ))}
            </div>
          </div>

          {/* Game Controls */}
          <div className="space-y-3">
            <Button
              onClick={handleStartGame}
              disabled={!canStartGame}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 disabled:opacity-50"
            >
              <Play className="w-5 h-5 mr-2" />
              {canStartGame ? 'Start Game' : `Need ${2 - room.players.length} more player(s)`}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleLeaveRoom}
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Leave Room
            </Button>
          </div>

          {/* Game Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">How to Play:</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• One player becomes the Puzzle Master</li>
              <li>• Create quotes/questions with secret answers</li>
              <li>• Other players guess the solutions</li>
              <li>• First correct guess wins!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}