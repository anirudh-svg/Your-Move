import React from 'react';
import { motion } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <motion.div
      className="font-mono h-full w-full flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-wide">
          Your Move
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-md mx-auto">
          A minimalist aim trainer for maximum focus.
        </p>
        <motion.button
          onClick={onStart}
          className="mt-12 inline-flex items-center gap-3 px-10 py-4 bg-gray-900 text-gray-100 font-semibold text-lg rounded-md transition-colors duration-300 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-900 focus:ring-opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <MousePointerClick size={22} />
          Start Training
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default StartScreen;
