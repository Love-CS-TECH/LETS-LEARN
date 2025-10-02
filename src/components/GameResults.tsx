import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, Crown, Target } from 'lucide-react';

interface Guess {
  player: string;
  guess: string;
  correct: boolean;
}

interface GameResultsProps {
  players: string[];
  puzzleMaster: number;
  secretWord: string;
  guesses: Guess[];
  onPlayAgain: () => void;
}

export default function GameResults({
  players,
  puzzleMaster,
  secretWord,
  guesses,
  onPlayAgain
}: GameResultsProps) {
  const correctGuess = guesses.find(guess => guess.correct);
  const winner = correctGuess ? correctGuess.player : null;
  const puzzleMasterName = players[puzzleMaster];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Header */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full w-16 h-16 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">Game Results</CardTitle>
            <CardDescription className="text-gray-600">
              The secret word was: <span className="font-bold text-2xl text-purple-700">{secretWord}</span>
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Winner Section */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Crown className="w-5 h-5 mr-2 text-yellow-600" />
                Game Outcome
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {winner ? (
                <div className="text-center space-y-4">
                  <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-yellow-800 mb-2">🎉 Winner!</h3>
                    <Badge variant="outline" className="text-xl px-4 py-2 border-yellow-300 text-yellow-800">
                      {winner}
                    </Badge>
                    <p className="text-yellow-700 mt-3">
                      Correctly guessed: <span className="font-bold">"{correctGuess?.guess}"</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <Target className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-purple-800 mb-2">🎭 Puzzle Master Wins!</h3>
                    <Badge variant="outline" className="text-xl px-4 py-2 border-purple-300 text-purple-800">
                      {puzzleMasterName}
                    </Badge>
                    <p className="text-purple-700 mt-3">
                      No one guessed the secret word correctly!
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center">
                <Button
                  onClick={onPlayAgain}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Game Summary */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">Game Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Puzzle Master</h4>
                  <Badge variant="outline" className="border-blue-300 text-blue-800">
                    {puzzleMasterName}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">All Guesses:</h4>
                  {guesses.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {guesses.map((guess, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            guess.correct
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{guess.player}</span>
                            <Badge
                              variant={guess.correct ? 'default' : 'secondary'}
                              className={guess.correct ? 'bg-green-600' : 'bg-gray-500'}
                            >
                              {guess.correct ? '✓ Correct!' : '✗ Wrong'}
                            </Badge>
                          </div>
                          <div className="text-gray-700 mt-1">"{guess.guess}"</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-600">No guesses were made!</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}