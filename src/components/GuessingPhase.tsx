import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, Target, Users, LogOut, Zap } from 'lucide-react';

interface Guess {
  player: string;
  guess: string;
  correct: boolean;
}

interface GuessingPhaseProps {
  players: string[];
  currentGuesser: number;
  puzzleMaster: number;
  clues: string[];
  guesses: Guess[];
  onGuessSubmit: (guess: string) => void;
}

export default function GuessingPhase({
  players,
  currentGuesser,
  puzzleMaster,
  clues,
  guesses,
  onGuessSubmit
}: GuessingPhaseProps) {
  const [currentGuess, setCurrentGuess] = useState('');
  const [quitPlayers, setQuitPlayers] = useState<string[]>([]);

  const handleSubmit = () => {
    if (currentGuess.trim()) {
      onGuessSubmit(currentGuess.trim());
      setCurrentGuess('');
    }
  };

  const handleQuit = () => {
    const currentPlayer = players[currentGuesser];
    const newQuitPlayers = [...quitPlayers, currentPlayer];
    setQuitPlayers(newQuitPlayers);
    
    // Check if all non-master players have quit
    const nonMasterPlayers = players.filter((_, index) => index !== puzzleMaster);
    if (newQuitPlayers.length === nonMasterPlayers.length) {
      // All players quit, show the answer
      onGuessSubmit('__SHOW_ANSWER__');
    } else {
      // Move to next player
      onGuessSubmit('__QUIT__');
    }
  };

  const currentPlayer = players[currentGuesser];
  const puzzleMasterName = players[puzzleMaster];
  const quoteQuestion = clues[0] || '';
  const hasPlayerQuit = quitPlayers.includes(currentPlayer);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Header with Holographic Effect */}
        <Card className="bg-gradient-to-r from-slate-900/95 to-purple-900/95 backdrop-blur-2xl shadow-2xl border border-cyan-400/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 animate-pulse"></div>
          <CardHeader className="text-center relative z-10">
            <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full w-20 h-20 flex items-center justify-center shadow-lg shadow-green-500/25 animate-pulse">
              <Brain className="w-10 h-10 text-white animate-spin-slow" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Neural Puzzle Matrix
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Puzzle Master: <span className="font-semibold text-blue-400">{puzzleMasterName}</span> • 
              Current Player: <span className="font-semibold text-green-400">{currentPlayer}</span>
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Enhanced Quote/Question Section */}
          <Card className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-2xl shadow-2xl border border-purple-400/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center text-white">
                <MessageSquare className="w-6 h-6 mr-3 text-purple-400 animate-pulse" />
                Neural Data Stream
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="p-8 bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-xl border border-purple-400/30 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="font-semibold text-purple-300 mb-4 flex items-center gap-3">
                    <Badge variant="outline" className="border-purple-300 text-purple-300 bg-purple-900/50 px-4 py-2">
                      <Zap className="w-4 h-4 mr-2" />
                      Decode This
                    </Badge>
                  </div>
                  <div className="text-white text-xl leading-relaxed font-medium text-center p-4 bg-black/20 rounded-lg border border-cyan-500/30">
                    <span className="text-cyan-300">"</span>
                    <span className="text-white">{quoteQuestion}</span>
                    <span className="text-cyan-300">"</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-800/30 to-blue-800/30 p-6 rounded-xl border border-cyan-400/30 backdrop-blur-sm">
                <h3 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Neural Mission Protocol
                </h3>
                <p className="text-cyan-100 leading-relaxed">
                  Analyze the quantum data stream above and decode the hidden solution. 
                  The answer could be a word, number, code, or any entity that resolves the neural puzzle matrix!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Guessing Section */}
          <div className="space-y-6">
            {/* Current Turn with Holographic Effect */}
            <Card className="bg-gradient-to-br from-green-900/90 to-blue-900/90 backdrop-blur-2xl shadow-2xl border border-green-400/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 animate-pulse"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center text-white">
                  <Target className="w-6 h-6 mr-3 text-green-400 animate-pulse" />
                  Neural Solution Interface
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-center space-y-6">
                  <div className="p-6 bg-gradient-to-r from-green-800/50 to-blue-800/50 rounded-xl border border-green-400/30 backdrop-blur-sm">
                    <Badge variant="outline" className="text-xl px-6 py-3 border-green-300 text-green-300 bg-green-900/50 mb-4">
                      <Brain className="w-5 h-5 mr-2 animate-pulse" />
                      {currentPlayer}'s Neural Turn
                    </Badge>
                    <p className="text-green-100 mt-3">
                      Decode the quantum puzzle and input your solution
                    </p>
                  </div>
                  
                  {!hasPlayerQuit ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          placeholder="Enter neural solution..."
                          value={currentGuess}
                          onChange={(e) => setCurrentGuess(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                          className="text-center text-xl bg-black/30 border-cyan-400/50 text-white placeholder-gray-400 backdrop-blur-sm h-14"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-md pointer-events-none animate-pulse"></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={handleSubmit}
                          disabled={!currentGuess.trim()}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 disabled:opacity-50 shadow-lg shadow-green-500/25"
                        >
                          <Brain className="w-5 h-5 mr-2" />
                          Submit Solution
                        </Button>
                        
                        <Button
                          onClick={handleQuit}
                          variant="outline"
                          className="border-red-400/50 text-red-300 hover:bg-red-900/30 hover:text-red-200 font-bold py-4 backdrop-blur-sm"
                        >
                          <LogOut className="w-5 h-5 mr-2" />
                          Quit Round
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-gradient-to-r from-red-800/50 to-orange-800/50 rounded-xl border border-red-400/30">
                      <p className="text-red-200 text-lg">
                        {currentPlayer} has quit this round
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Previous Guesses */}
            {(guesses.length > 0 || quitPlayers.length > 0) && (
              <Card className="bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-2xl shadow-2xl border border-gray-400/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Users className="w-6 h-6 text-gray-400" />
                    Neural Activity Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {guesses.map((guess, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border backdrop-blur-sm ${
                          guess.correct
                            ? 'bg-gradient-to-r from-green-800/50 to-emerald-800/50 border-green-400/30'
                            : 'bg-gradient-to-r from-red-800/50 to-pink-800/50 border-red-400/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{guess.player}</span>
                          <Badge
                            variant={guess.correct ? 'default' : 'destructive'}
                            className={`${guess.correct ? 'bg-green-600 shadow-green-500/25' : 'bg-red-600 shadow-red-500/25'} shadow-lg`}
                          >
                            {guess.correct ? '✓ Neural Match!' : '✗ Invalid Solution'}
                          </Badge>
                        </div>
                        <div className="text-gray-300 mt-2 font-mono">"{guess.guess}"</div>
                      </div>
                    ))}
                    
                    {quitPlayers.map((player, index) => (
                      <div
                        key={`quit-${index}`}
                        className="p-4 rounded-xl border bg-gradient-to-r from-orange-800/50 to-red-800/50 border-orange-400/30 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{player}</span>
                          <Badge className="bg-orange-600 shadow-orange-500/25 shadow-lg">
                            <LogOut className="w-4 h-4 mr-1" />
                            Disconnected
                          </Badge>
                        </div>
                        <div className="text-orange-200 mt-2 italic">Neural link terminated</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}