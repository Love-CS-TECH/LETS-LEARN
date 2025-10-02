import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, MessageSquare } from 'lucide-react';

interface PuzzleData {
  secretWord: string;
  puzzleHint: string;
}

interface PuzzleCreationProps {
  puzzleMaster: string;
  puzzleData: PuzzleData;
  onCluesSubmit: (clues: string[]) => void;
}

export default function PuzzleCreation({ puzzleMaster, puzzleData, onCluesSubmit }: PuzzleCreationProps) {
  const [processing, setProcessing] = useState(false);

  const handleStartGuessing = () => {
    setProcessing(true);
    
    // Simulate neural processing
    setTimeout(() => {
      // Pass the quote/question as the "clue" that players will see
      onCluesSubmit([puzzleData.puzzleHint]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-cyan-400/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Neural Processing</CardTitle>
          <CardDescription className="text-gray-600">
            <span className="font-semibold text-cyan-700">{puzzleMaster}</span>, your puzzle is being processed by the neural network
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Secret Solution Display */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Secret Solution (Hidden from players)
            </h3>
            <div className="p-3 bg-white rounded border border-red-300">
              <p className="text-gray-800 font-mono text-xl text-center">
                {puzzleData.secretWord}
              </p>
            </div>
          </div>

          {/* Quote/Question Display */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border border-cyan-200">
            <h3 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Quote/Question (Shown to players)
            </h3>
            <div className="p-4 bg-white rounded border border-cyan-300">
              <p className="text-gray-800 text-lg leading-relaxed">
                "{puzzleData.puzzleHint}"
              </p>
            </div>
          </div>

          {processing ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-cyan-200 rounded-full animate-spin border-t-cyan-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-cyan-600 animate-pulse" />
                  </div>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-800">
                🧠 Neural network is analyzing the puzzle...
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
              </div>
              <p className="text-sm text-gray-600">
                Preparing quantum puzzle matrix...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">🎯 How the Neural Puzzle Works:</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Players will see only your quote/question</li>
                  <li>• They must solve the quote/question to guess your secret solution</li>
                  <li>• First correct guess of the solution wins the round</li>
                  <li>• If no one guesses correctly, you win as Puzzle Master!</li>
                </ul>
              </div>

              <Button
                onClick={handleStartGuessing}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4"
              >
                <Brain className="w-5 h-5 mr-2" />
                Activate Neural Puzzle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}