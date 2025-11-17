import React from 'react';
import { Timer, Crosshair, Percent } from 'lucide-react';

interface HUDProps {
  timer: number;
  score: number;
  accuracy: number;
}

const HUD: React.FC<HUDProps> = ({ timer, score, accuracy }) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-white z-10 pointer-events-none bg-gradient-to-b from-black/50 to-transparent">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Crosshair className="text-cyan-400" size={20} />
          <span className="text-2xl font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Percent className="text-cyan-400" size={20} />
          <span className="text-2xl font-bold">{accuracy}%</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Timer className="text-cyan-400" size={20} />
        <span className="text-2xl font-bold">{timer}s</span>
      </div>
    </div>
  );
};

export default HUD;
