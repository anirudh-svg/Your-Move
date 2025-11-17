import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Repeat, BarChart2, Zap, Percent } from 'lucide-react';

interface GameSummaryProps {
  hits: number;
  accuracy: number;
  avgReactionTime: number;
  onRestart: () => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; unit: string }> = ({ icon, label, value, unit }) => (
  <div className="bg-slate-700/50 p-6 rounded-lg flex flex-col items-center justify-center text-center">
    <div className="text-cyan-400 mb-3">{icon}</div>
    <p className="text-slate-300 text-sm">{label}</p>
    <p className="text-3xl font-bold text-white">
      {value}<span className="text-lg ml-1">{unit}</span>
    </p>
  </div>
);

const GameSummary: React.FC<GameSummaryProps> = ({ hits, accuracy, avgReactionTime, onRestart }) => {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/80 backdrop-blur-sm z-20 p-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <Trophy className="mx-auto text-yellow-400 mb-4" size={64} />
        <h2 className="text-4xl md:text-5xl font-bold text-white">Session Complete</h2>
      </div>

      <motion.div 
        className="my-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3,
            }
          }
        }}
      >
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <StatCard icon={<BarChart2 size={32} />} label="Targets Hit" value={hits} unit="" />
        </motion.div>
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <StatCard icon={<Percent size={32} />} label="Accuracy" value={accuracy} unit="%" />
        </motion.div>
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <StatCard icon={<Zap size={32} />} label="Avg. Reaction" value={avgReactionTime} unit="ms" />
        </motion.div>
      </motion.div>

      <button
        onClick={onRestart}
        className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-500 text-slate-900 font-bold text-xl rounded-lg shadow-lg transition-all duration-300 hover:bg-cyan-400 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
      >
        <Repeat size={24} />
        Play Again
      </button>
    </motion.div>
  );
};

export default GameSummary;
