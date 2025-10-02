import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Globe, Users, Sparkles, Zap, Brain, Gamepad2 } from 'lucide-react';

interface FuturisticLandingProps {
  onSelectMode: (mode: 'local' | 'online') => void;
}

export default function FuturisticLanding({ onSelectMode }: FuturisticLandingProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern animate-pulse" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-600 rounded-full animate-ping opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Logo/Title Section */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative mb-6">
            {/* 3D Brain Icon */}
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500">
                <Brain className="w-16 h-16 text-white animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce">
                  <Sparkles className="w-4 h-4 text-white m-1" />
                </div>
              </div>
              
              {/* Orbiting Elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full blur-sm" />
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full blur-sm" />
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pink-400 rounded-full blur-sm" />
                <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full blur-sm" />
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent animate-pulse">
            PUZZLE
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-800 via-blue-800 to-gray-800 bg-clip-text text-transparent">
            SOLVER
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent to-cyan-600 rounded-full" />
            <Zap className="w-6 h-6 text-yellow-600 animate-bounce" />
            <div className="h-1 w-16 bg-gradient-to-l from-transparent to-purple-600 rounded-full" />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Kosis se todi na ja saki aisi koi deewar nehi hoti, aur jo kosis kare uski kabhi haar nehi hoti
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className={`grid md:grid-cols-2 gap-8 max-w-4xl w-full transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Local Game Card */}
          <Card className="relative group overflow-hidden backdrop-blur-xl bg-white/80 border border-gray-300 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-8 text-center">
              <div className="mb-6 relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-shadow duration-500">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="w-4 h-4 text-white m-1" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-cyan-700 transition-colors duration-300">
                🏠 Local Game
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Samjho khudko ki kon ho,samjho usko ki kon hai o,tabhi to kahoge aage bado saath tum ho!
              </p>
              
              <div className="space-y-3 mb-6 text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span>2-3 Players</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span>3D Bottle Animation</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                  <span>Instant Start</span>
                </div>
              </div>
              
              <Button
                onClick={() => onSelectMode('local')}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-4 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 group-hover:shadow-2xl"
              >
                <Users className="w-5 h-5 mr-2" />
                Start Local Game
              </Button>
            </div>
          </Card>

          {/* Online Game Card */}
          <Card className="relative group overflow-hidden backdrop-blur-xl bg-white/80 border border-gray-300 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-8 text-center">
              <div className="mb-6 relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-shadow duration-500">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Zap className="w-4 h-4 text-white m-1" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-700 transition-colors duration-300">
                🌐 Online Game
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Jodo usko jo dur hai,Saath chehra nehi par sath honeka aishas jarur hai!
              </p>
              
              <div className="space-y-3 mb-6 text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span>Global Multiplayer</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                  <span>Room Codes & Links</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span>Real-time Sync</span>
                </div>
              </div>
              
              <Button
                onClick={() => onSelectMode('online')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 group-hover:shadow-2xl"
              >
                <Globe className="w-5 h-5 mr-2" />
                Join Online Game
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer Features */}
        <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center p-4 backdrop-blur-sm bg-white/60 rounded-lg border border-gray-200">
            <Gamepad2 className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
            <h4 className="text-gray-800 font-semibold mb-1">Mystical Selection</h4>
            <p className="text-gray-600 text-sm">3D bottle spins to choose your puzzle master</p>
          </div>
          <div className="text-center p-4 backdrop-blur-sm bg-white/60 rounded-lg border border-gray-200">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="text-gray-800 font-semibold mb-1">Mind Challenges</h4>
            <p className="text-gray-600 text-sm">Create cryptic clues and solve mysteries</p>
          </div>
          <div className="text-center p-4 backdrop-blur-sm bg-white/60 rounded-lg border border-gray-200">
            <Sparkles className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <h4 className="text-gray-800 font-semibold mb-1">Epic Battles</h4>
            <p className="text-gray-600 text-sm">Compete in turn-based puzzle warfare</p>
          </div>
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="absolute top-10 right-10 opacity-50">
        <div className="w-4 h-4 bg-cyan-600 rounded-full animate-ping" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-50">
        <div className="w-3 h-3 bg-purple-600 rounded-full animate-ping delay-1000" />
      </div>
      <div className="absolute top-1/3 left-10 opacity-30">
        <div className="w-2 h-2 bg-pink-600 rounded-full animate-ping delay-500" />
      </div>
      <div className="absolute bottom-1/3 right-10 opacity-30">
        <div className="w-2 h-2 bg-yellow-600 rounded-full animate-ping delay-1500" />
      </div>
    </div>
  );
}