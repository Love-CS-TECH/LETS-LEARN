import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { gameSocket, GameRoom } from '@/lib/socket';
import { Users, Crown, Copy, Check, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import BottleAnimation from './BottleAnimation';

interface OnlineGameLobbyProps {
  room: GameRoom;
  currentPlayer: string;
  onStartGame: (players: string[], puzzleMaster: number) => void;
  onLeaveRoom: () => void;
}

export default function OnlineGameLobby({ room, currentPlayer, onStartGame, onLeaveRoom }: OnlineGameLobbyProps) {
  const [currentRoom, setCurrentRoom] = useState<GameRoom>(room);
  const [showBottleAnimation, setShowBottleAnimation] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleRoomUpdate = (updatedRoom: GameRoom) => {
      setCurrentRoom(updatedRoom);
    };

    gameSocket.onRoomUpdate(handleRoomUpdate);

    return () => {
      gameSocket.offRoomUpdate(handleRoomUpdate);
    };
  }, []);

  const isHost = currentRoom.host === currentPlayer;
  const canStartGame = currentRoom.players.length >= 2;

  const handleStartGame = () => {
    if (canStartGame) {
      setShowBottleAnimation(true);
    }
  };

  const handlePuzzleMasterSelected = (masterIndex: number) => {
    setShowBottleAnimation(false);
    setTimeout(() => {
      onStartGame(currentRoom.players, masterIndex);
    }, 1000);
  };

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(currentRoom.code);
    setCopiedCode(true);
    toast.success('Room code copied!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyRoomLink = async () => {
    const link = `${window.location.origin}?room=${currentRoom.code}`;
    await navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success('Room link copied!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (showBottleAnimation) {
    return (
      <BottleAnimation
        players={currentRoom.players}
        onPuzzleMasterSelected={handlePuzzleMasterSelected}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 p-6">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Game Lobby</CardTitle>
          <CardDescription className="text-gray-600">
            Room: <span className="font-mono font-bold text-gray-800">{currentRoom.code}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Room Code Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded border">
              <span className="font-mono text-lg text-gray-800">{currentRoom.code}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyRoomCode}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={copyRoomLink}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {copiedLink ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy Shareable Link
            </Button>
          </div>

          {/* Players List */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Players ({currentRoom.players.length}/3)
            </h3>
            <div className="space-y-2">
              {currentRoom.players.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                >
                  <span className="font-medium text-gray-800">{player}</span>
                  <div className="flex items-center gap-2">
                    {player === currentRoom.host && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Crown className="w-3 h-3 mr-1" />
                        Host
                      </Badge>
                    )}
                    {player === currentPlayer && (
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        You
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Controls */}
          <div className="space-y-3">
            {isHost ? (
              <Button
                onClick={handleStartGame}
                disabled={!canStartGame}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 disabled:opacity-50"
              >
                🍾 Start Game ({currentRoom.players.length} players)
              </Button>
            ) : (
              <div className="text-center p-4 bg-blue-50 rounded border border-blue-200">
                <p className="text-blue-800 font-medium">
                  Waiting for {currentRoom.host} to start the game...
                </p>
                {!canStartGame && (
                  <p className="text-blue-600 text-sm mt-1">
                    Need at least 2 players to start
                  </p>
                )}
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={onLeaveRoom}
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave Room
            </Button>
          </div>

          {/* Status */}
          <div className="text-center text-sm text-gray-500">
            {canStartGame ? (
              isHost ? 'Ready to start!' : 'Waiting for host...'
            ) : (
              'Waiting for more players...'
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}