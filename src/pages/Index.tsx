import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import FuturisticLanding from '@/components/FuturisticLanding';
import GameSetup from '@/components/GameSetup';
import RoomSetup from '@/components/RoomSetup';
import OnlineGameLobby from '@/components/OnlineGameLobby';
import WordInput from '@/components/WordInput';
import PuzzleCreation from '@/components/PuzzleCreation';
import GuessingPhase from '@/components/GuessingPhase';
import GameResults from '@/components/GameResults';
import { GameRoom } from '@/lib/socket';

type GamePhase = 'landing' | 'setup' | 'room-setup' | 'lobby' | 'word-input' | 'puzzle-creation' | 'guessing' | 'results';
type GameMode = 'local' | 'online';

interface Guess {
  player: string;
  guess: string;
  correct: boolean;
}

interface PuzzleData {
  secretWord: string;
  puzzleHint: string;
}

export default function Index() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('landing');
  const [gameMode, setGameMode] = useState<GameMode>('local');
  const [players, setPlayers] = useState<string[]>([]);
  const [puzzleMaster, setPuzzleMaster] = useState<number>(0);
  const [currentGuesser, setCurrentGuesser] = useState<number>(0);
  const [puzzleData, setPuzzleData] = useState<PuzzleData>({ secretWord: '', puzzleHint: '' });
  const [clues, setClues] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [quitPlayers, setQuitPlayers] = useState<string[]>([]);

  // Check for room code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    if (roomCode) {
      setGameMode('online');
      setGamePhase('room-setup');
    }
  }, []);

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'local') {
      setGamePhase('setup');
    } else {
      setGamePhase('room-setup');
    }
  };

  const handleGameStart = (playerList: string[], masterIndex: number) => {
    setPlayers(playerList);
    setPuzzleMaster(masterIndex);
    setCurrentGuesser(masterIndex === 0 ? 1 : 0);
    setGamePhase('word-input');
  };

  const handleWordSubmit = (data: PuzzleData) => {
    setPuzzleData(data);
    setGamePhase('puzzle-creation');
  };

  const handleCluesSubmit = (clueList: string[]) => {
    setClues(clueList);
    setGamePhase('guessing');
  };

  const handleGuessSubmit = (guess: string) => {
    // Handle quit functionality
    if (guess === '__QUIT__') {
      const currentPlayerName = players[currentGuesser];
      const newQuitPlayers = [...quitPlayers, currentPlayerName];
      setQuitPlayers(newQuitPlayers);
      
      // Move to next guesser
      const nextGuesser = getNextGuesser();
      if (nextGuesser === -1) {
        // All players have quit or guessed, show results
        setGamePhase('results');
        toast.info('All players have finished! Showing results...');
      } else {
        setCurrentGuesser(nextGuesser);
        toast.info(`${currentPlayerName} quit the round. Next player's turn.`);
      }
      return;
    }

    // Handle show answer when all quit
    if (guess === '__SHOW_ANSWER__') {
      setGamePhase('results');
      toast.info('All players quit! Revealing the answer...');
      return;
    }

    const isCorrect = guess.toLowerCase() === puzzleData.secretWord.toLowerCase();
    const newGuess: Guess = {
      player: players[currentGuesser],
      guess,
      correct: isCorrect
    };

    const updatedGuesses = [...guesses, newGuess];
    setGuesses(updatedGuesses);

    if (isCorrect) {
      setGamePhase('results');
      toast.success(`${players[currentGuesser]} decoded the neural puzzle!`);
    } else {
      // Move to next guesser
      const nextGuesser = getNextGuesser();
      if (nextGuesser === -1) {
        // All players have guessed, puzzle master wins
        setGamePhase('results');
        toast.info('Neural matrix complete! Puzzle Master wins!');
      } else {
        setCurrentGuesser(nextGuesser);
        toast.error('Invalid solution! Next neural link activated.');
      }
    }
  };

  const getNextGuesser = (): number => {
    const nonMasterPlayers = players
      .map((_, index) => index)
      .filter(index => index !== puzzleMaster);
    
    // Filter out players who have quit
    const activePlayers = nonMasterPlayers.filter(index => 
      !quitPlayers.includes(players[index])
    );
    
    const currentIndex = activePlayers.indexOf(currentGuesser);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= activePlayers.length) {
      return -1; // All active players have guessed
    }
    
    return activePlayers[nextIndex];
  };

  const handlePlayAgain = () => {
    setGuesses([]);
    setClues([]);
    setPuzzleData({ secretWord: '', puzzleHint: '' });
    setQuitPlayers([]);
    setGamePhase('setup');
  };

  const handleRoomJoined = (gameRoom: GameRoom, playerName: string) => {
    setRoom(gameRoom);
    setCurrentPlayer(playerName);
    setGamePhase('lobby');
  };

  const handleLeaveRoom = () => {
    setRoom(null);
    setCurrentPlayer('');
    setGamePhase('room-setup');
  };

  const renderCurrentPhase = () => {
    switch (gamePhase) {
      case 'landing':
        return <FuturisticLanding onSelectMode={handleModeSelect} />;
      
      case 'setup':
        return <GameSetup onStartGame={handleGameStart} />;
      
      case 'room-setup':
        return <RoomSetup onRoomJoined={handleRoomJoined} />;
      
      case 'lobby':
        return room ? (
          <OnlineGameLobby
            room={room}
            currentPlayer={currentPlayer}
            onStartGame={handleGameStart}
            onLeaveRoom={handleLeaveRoom}
          />
        ) : null;
      
      case 'word-input':
        return (
          <WordInput
            puzzleMaster={players[puzzleMaster]}
            onWordSubmit={handleWordSubmit}
          />
        );
      
      case 'puzzle-creation':
        return (
          <PuzzleCreation
            puzzleMaster={players[puzzleMaster]}
            puzzleData={puzzleData}
            onCluesSubmit={handleCluesSubmit}
          />
        );
      
      case 'guessing':
        return (
          <GuessingPhase
            players={players}
            currentGuesser={currentGuesser}
            puzzleMaster={puzzleMaster}
            clues={clues}
            guesses={guesses}
            onGuessSubmit={handleGuessSubmit}
          />
        );
      
      case 'results':
        return (
          <GameResults
            players={players}
            puzzleMaster={puzzleMaster}
            secretWord={puzzleData.secretWord}
            guesses={guesses}
            onPlayAgain={handlePlayAgain}
          />
        );
      
      default:
        return <FuturisticLanding onSelectMode={handleModeSelect} />;
    }
  };

  return <div className="min-h-screen">{renderCurrentPhase()}</div>;
}