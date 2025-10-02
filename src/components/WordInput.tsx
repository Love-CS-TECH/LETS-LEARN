import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Brain, Target, MessageSquare } from 'lucide-react';

interface WordInputProps {
  puzzleMaster: string;
  onWordSubmit: (data: { secretWord: string; puzzleHint: string }) => void;
}

export default function WordInput({ puzzleMaster, onWordSubmit }: WordInputProps) {
  const [secretAnswer, setSecretAnswer] = useState('');
  const [quoteQuestion, setQuoteQuestion] = useState('');
  const [showSecretAnswer, setShowSecretAnswer] = useState(false);
  const [showQuoteQuestion, setShowQuoteQuestion] = useState(false);

  const handleSubmit = () => {
    if (secretAnswer.trim() && quoteQuestion.trim()) {
      onWordSubmit({
        secretWord: secretAnswer.trim(),
        puzzleHint: quoteQuestion.trim()
      });
    }
  };

  const canSubmit = secretAnswer.trim() && quoteQuestion.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-cyan-400/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full w-16 h-16 flex items-center justify-center">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Neural Puzzle Creator</CardTitle>
          <CardDescription className="text-gray-600">
            <span className="font-semibold text-purple-700">{puzzleMaster}</span>, create your secret solution and puzzle question
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-700 text-center">
              <strong className="text-gray-800">{puzzleMaster}</strong>, enter the secret answer/solution and create a quote or question that hints at it. 
              Other players will see only your quote/question and must guess the secret solution!
            </p>
          </div>

          {/* Secret Solution Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-red-600" />
              <label className="block text-sm font-medium text-gray-700">
                Secret Solution/Answer (What players need to guess)
              </label>
            </div>
            <div className="relative">
              <Input
                type={showSecretAnswer ? 'text' : 'password'}
                placeholder="e.g., JAVASCRIPT, 42, LOVE, RAINBOW..."
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
                className="pr-12 bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                maxLength={50}
              />
              <button
                type="button"
                onClick={() => setShowSecretAnswer(!showSecretAnswer)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showSecretAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              This is the solution players are trying to guess - keep it hidden!
            </p>
          </div>

          {/* Quote/Question Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <label className="block text-sm font-medium text-gray-700">
                Quote/Question/Riddle (Hint that leads to the solution)
              </label>
            </div>
            <div className="relative">
              <Textarea
                placeholder='e.g., "The language of the web that makes pages interactive" or "What is the answer to life, universe and everything?" or "What emotion conquers all?"'
                value={quoteQuestion}
                onChange={(e) => setQuoteQuestion(e.target.value)}
                className={`min-h-[120px] pr-12 bg-white border-gray-300 text-gray-800 placeholder-gray-500 ${!showQuoteQuestion ? 'text-transparent' : ''}`}
                style={!showQuoteQuestion ? { 
                  textShadow: '0 0 8px rgba(0,0,0,0.5)',
                  color: 'transparent'
                } : {}}
                maxLength={500}
              />
              <button
                type="button"
                onClick={() => setShowQuoteQuestion(!showQuoteQuestion)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 z-10"
              >
                {showQuoteQuestion ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              This quote/question will be shown to players - make it clever but solvable!
            </p>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border border-cyan-200">
            <h3 className="font-semibold text-cyan-800 mb-2">💡 Example Combinations:</h3>
            <ul className="text-sm text-cyan-700 space-y-2">
              <li><strong>Solution:</strong> JAVASCRIPT → <strong>Question:</strong> "What programming language makes websites interactive?"</li>
              <li><strong>Solution:</strong> 42 → <strong>Quote:</strong> "The answer to life, the universe, and everything"</li>
              <li><strong>Solution:</strong> RAINBOW → <strong>Riddle:</strong> "I appear after rain, with colors seven, arching high up in heaven"</li>
            </ul>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 disabled:opacity-50"
          >
            Create Neural Puzzle
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            Both the solution and quote/question are required!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}