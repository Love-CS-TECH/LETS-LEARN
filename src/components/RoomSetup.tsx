import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { gameSocket, GameRoom } from '@/lib/socket';
import { Users, Globe, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface RoomSetupProps {
  onRoomJoined: (room: GameRoom, playerName: string) => void;
}

export default function RoomSetup({ onRoomJoined }: RoomSetupProps) {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<GameRoom | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const createRoom = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsCreating(true);
    try {
      const room = await gameSocket.createRoom(playerName.trim());
      setCreatedRoom(room);
      toast.success('Room created successfully!');
    } catch (error) {
      toast.error('Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!roomCode.trim()) {
      toast.error('Please enter room code');
      return;
    }

    setIsJoining(true);
    try {
      const room = await gameSocket.joinRoom(roomCode.trim().toUpperCase(), playerName.trim());
      onRoomJoined(room, playerName.trim());
      toast.success('Joined room successfully!');
    } catch (error) {
      toast.error('Failed to join room. Check the room code.');
    } finally {
      setIsJoining(false);
    }
  };

  const joinCreatedRoom = () => {
    if (createdRoom) {
      onRoomJoined(createdRoom, playerName);
    }
  };

  const copyRoomCode = async () => {
    if (createdRoom) {
      await navigator.clipboard.writeText(createdRoom.code);
      setCopiedCode(true);
      toast.success('Room code copied!');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const copyRoomLink = async () => {
    if (createdRoom) {
      const link = `${window.location.origin}?room=${createdRoom.code}`;
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      toast.success('Room link copied!');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 p-6">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full w-16 h-16 flex items-center justify-center">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Online Game</CardTitle>
          <CardDescription className="text-gray-600">
            Create or join a room to play with friends
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            />
          </div>

          {createdRoom ? (
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-800 mb-2">Room Created!</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded border">
                    <span className="font-mono text-lg text-gray-800">{createdRoom.code}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyRoomCode}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
              </div>
              
              <Button
                onClick={joinCreatedRoom}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3"
              >
                Enter Room
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="create" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-800">Create Room</TabsTrigger>
                <TabsTrigger value="join" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-800">Join Room</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="space-y-4">
                <Button
                  onClick={createRoom}
                  disabled={isCreating || !playerName.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 disabled:opacity-50"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {isCreating ? 'Creating...' : 'Create Room'}
                </Button>
              </TabsContent>
              
              <TabsContent value="join" className="space-y-4">
                <Input
                  placeholder="Room code (e.g., GAME-A1B2)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                />
                <Button
                  onClick={joinRoom}
                  disabled={isJoining || !playerName.trim() || !roomCode.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 disabled:opacity-50"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {isJoining ? 'Joining...' : 'Join Room'}
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}