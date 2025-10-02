import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Trash2 } from 'lucide-react';
import BottleAnimation from './BottleAnimation';

interface GameSetupProps {
  onStartGame: (players: string[], puzzleMaster: number) => void;
}

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [players, setPlayers] = useState<string[]>(['', '']);
  const [showBottleAnimation, setShowBottleAnimation] = useState(false);
  const [selectedPuzzleMaster, setSelectedPuzzleMaster] = useState<number | null>(null);

  const addPlayer = () => {
    if (players.length < 3) {
      setPlayers([...players, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
    }
  };

  const updatePlayer = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const handleSelectPuzzleMaster = () => {
    const validPlayers = players.filter(name => name.trim() !== '');
    if (validPlayers.length >= 2) {
      setShowBottleAnimation(true);
    }
  };

  const handlePuzzleMasterSelected = (masterIndex: number) => {
    setSelectedPuzzleMaster(masterIndex);
    setShowBottleAnimation(false);
    
    setTimeout(() => {
      const validPlayers = players.filter(name => name.trim() !== '');
      onStartGame(validPlayers, masterIndex);
    }, 1000);
  };

  const validPlayers = players.filter(name => name.trim() !== '');
  const canStart = validPlayers.length >= 2;

  if (showBottleAnimation) {
    return (
      <BottleAnimation
        players={validPlayers}
        onPuzzleMasterSelected={handlePuzzleMasterSelected}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 p-6">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Game Setup</CardTitle>
          <CardDescription className="text-gray-600">
            Add 2-3 players to start your puzzle adventure
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {players.map((player, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder={`Player ${index + 1} name`}
                  value={player}
                  onChange={(e) => updatePlayer(index, e.target.value)}
                  className="bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                />
              </div>
              {players.length > 2 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removePlayer(index)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          
          {players.length < 3 && (
            <Button
              variant="outline"
              onClick={addPlayer}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </Button>
          )}
          
          <div className="pt-4">
            <Button
              onClick={handleSelectPuzzleMaster}
              disabled={!canStart}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🍾 Spin the Mystical Bottle
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            The bottle will choose your puzzle master!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}