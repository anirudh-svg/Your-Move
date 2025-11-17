import React, { useState, useCallback, useMemo } from 'react';
import { GameStatus, GameStats } from '../types';
import StartScreen from './StartScreen';
import GameCanvas from './GameCanvas';
import HUD from './HUD';
import GameSummary from './GameSummary';
import { AnimatePresence } from 'framer-motion';

const GAME_DURATION = 60; // seconds

const GameContainer: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('start');
  const [stats, setStats] = useState<GameStats>({ hits: 0, misses: 0, totalShots: 0, reactionTimes: [] });
  const [timer, setTimer] = useState(GAME_DURATION);

  const accuracy = useMemo(() => {
    if (stats.totalShots === 0) return 0;
    return Math.round((stats.hits / stats.totalShots) * 100);
  }, [stats.hits, stats.totalShots]);

  const avgReactionTime = useMemo(() => {
    if (stats.reactionTimes.length === 0) return 0;
    const sum = stats.reactionTimes.reduce((a, b) => a + b, 0);
    return Math.round(sum / stats.reactionTimes.length);
  }, [stats.reactionTimes]);

  const handleStartGame = useCallback(() => {
    setStats({ hits: 0, misses: 0, totalShots: 0, reactionTimes: [] });
    setTimer(GAME_DURATION);
    setGameStatus('playing');
  }, []);

  const handleEndGame = useCallback(() => {
    setGameStatus('summary');
  }, []);

  const handleRestart = useCallback(() => {
    handleStartGame();
  }, [handleStartGame]);

  const handleTargetHit = useCallback((reactionTime: number) => {
    setStats(prev => ({
      ...prev,
      hits: prev.hits + 1,
      totalShots: prev.totalShots + 1,
      reactionTimes: [...prev.reactionTimes, reactionTime],
    }));
  }, []);

  const handleMiss = useCallback(() => {
    setStats(prev => ({
      ...prev,
      misses: prev.misses + 1,
      totalShots: prev.totalShots + 1,
    }));
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-800 overflow-hidden">
      <AnimatePresence mode="wait">
        {gameStatus === 'start' && (
          <StartScreen key="start" onStart={handleStartGame} />
        )}
        {gameStatus === 'playing' && (
          <div key="game" className="w-full h-full">
            <HUD timer={timer} score={stats.hits} accuracy={accuracy} />
            <GameCanvas
              onGameEnd={handleEndGame}
              onTargetHit={handleTargetHit}
              onMiss={handleMiss}
              setTimer={setTimer}
              gameDuration={GAME_DURATION}
            />
          </div>
        )}
        {gameStatus === 'summary' && (
          <GameSummary
            key="summary"
            hits={stats.hits}
            accuracy={accuracy}
            avgReactionTime={avgReactionTime}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameContainer;
