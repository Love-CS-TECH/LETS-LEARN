import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface BottleAnimationProps {
  players: string[];
  onPuzzleMasterSelected: (masterIndex: number) => void;
}

export default function BottleAnimation({ players, onPuzzleMasterSelected }: BottleAnimationProps) {
  const [isSpinning, setIsSpinning] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentSpinIndex, setCurrentSpinIndex] = useState(0);

  useEffect(() => {
    if (players.length === 0) return;

    // Randomize spinning animation
    const spinInterval = setInterval(() => {
      setCurrentSpinIndex(Math.floor(Math.random() * players.length));
    }, 150);

    // Random spin duration between 3-5 seconds
    const spinDuration = 3000 + Math.random() * 2000;
    
    const timer = setTimeout(() => {
      clearInterval(spinInterval);
      
      // Final random selection
      const randomIndex = Math.floor(Math.random() * players.length);
      setSelectedIndex(randomIndex);
      setIsSpinning(false);
      setShowResult(true);
      
      // Show result for 2 seconds then proceed
      setTimeout(() => {
        onPuzzleMasterSelected(randomIndex);
      }, 2000);
    }, spinDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(spinInterval);
    };
  }, [players, onPuzzleMasterSelected]);

  if (players.length === 0) {
    return <div>No players available</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Neural Puzzle Master Selection
          </CardTitle>
          <p className="text-gray-600">
            The quantum bottle is selecting your puzzle master...
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Bottle Animation */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Bottle Container */}
              <div 
                className={`w-32 h-48 relative ${isSpinning ? 'animate-spin' : ''}`}
                style={{ 
                  animationDuration: isSpinning ? '0.5s' : '0s',
                  animationIterationCount: 'infinite'
                }}
              >
                {/* Bottle Body */}
                <div className="absolute inset-x-4 top-8 bottom-4 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full shadow-lg">
                  {/* Bottle Neck */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-gradient-to-b from-emerald-300 to-emerald-400 rounded-t-lg"></div>
                  
                  {/* Bottle Cap */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-t-full border-2 border-amber-700"></div>
                  
                  {/* Magical Sparkles */}
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                        style={{
                          left: `${20 + (i * 10)}%`,
                          top: `${20 + (i * 8)}%`,
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: '1.5s'
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Bottle Label */}
                  <div className="absolute inset-x-2 top-4 bottom-8 bg-white/80 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs font-bold text-gray-800 mb-1">NEURAL</div>
                      <div className="text-xs font-bold text-purple-600">SELECTOR</div>
                      <div className="w-8 h-0.5 bg-purple-400 mx-auto mt-1"></div>
                    </div>
                  </div>
                </div>
                
                {/* Magical Aura */}
                <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center space-y-3">
            {isSpinning ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-800">
                  🧠 Neural quantum selection active...
                </p>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">
                    {players[currentSpinIndex]}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Analyzing neural patterns...
                </p>
              </div>
            ) : showResult && selectedIndex !== null ? (
              <div className="space-y-2">
                <p className="text-xl font-bold text-purple-700">
                  ✨ Neural selection complete! ✨
                </p>
                <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                  <p className="text-2xl font-bold text-gray-800">
                    {players[selectedIndex]}
                  </p>
                  <p className="text-sm text-purple-600 mt-1">
                    is the Neural Puzzle Master!
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Prepare to create quantum puzzles! 🧙‍♂️
                </p>
              </div>
            ) : null}
          </div>

          {/* Players List */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Neural Candidates:</h3>
            <div className="space-y-1">
              {players.map((player, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded ${
                    selectedIndex === index && showResult
                      ? 'bg-purple-100 border border-purple-300'
                      : isSpinning && currentSpinIndex === index
                        ? 'bg-blue-100 border border-blue-300'
                        : 'bg-white border border-gray-100'
                  }`}
                >
                  <span className={`font-medium ${
                    selectedIndex === index && showResult
                      ? 'text-purple-800'
                      : isSpinning && currentSpinIndex === index
                        ? 'text-blue-800'
                        : 'text-gray-800'
                  }`}>
                    {player}
                  </span>
                  {selectedIndex === index && showResult && (
                    <span className="text-purple-600 text-sm font-bold">🧠 Selected!</span>
                  )}
                  {isSpinning && currentSpinIndex === index && (
                    <span className="text-blue-600 text-sm font-bold animate-pulse">🔄</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}