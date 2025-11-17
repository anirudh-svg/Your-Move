import React, { useRef, useEffect, useCallback } from 'react';
import { Target, Particle } from '../types';

interface GameCanvasProps {
  onGameEnd: () => void;
  onTargetHit: (reactionTime: number) => void;
  onMiss: () => void;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  gameDuration: number;
}

const TARGET_RADIUS = 25;
const SPAWN_DELAY_MIN = 800; // Slower spawn
const SPAWN_DELAY_MAX = 1500; // Slower spawn

const GameCanvas: React.FC<GameCanvasProps> = ({ onGameEnd, onTargetHit, onMiss, setTimer, gameDuration }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const timerIntervalId = useRef<NodeJS.Timeout>();

  // Game state is stored in refs to prevent re-renders from interfering with the game loop
  const target = useRef<Target | null>(null);
  const particles = useRef<Particle[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const shake = useRef(0);

  const spawnTarget = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const spawnDelay = Math.random() * (SPAWN_DELAY_MAX - SPAWN_DELAY_MIN) + SPAWN_DELAY_MIN;
    
    setTimeout(() => {
      target.current = {
        id: Date.now(),
        x: Math.random() * (canvas.width - TARGET_RADIUS * 2) + TARGET_RADIUS,
        y: Math.random() * (canvas.height - TARGET_RADIUS * 2) + TARGET_RADIUS,
        radius: TARGET_RADIUS,
        spawnTime: performance.now(),
      };
    }, spawnDelay);
  }, []);

  // Main game loop and event handler setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Game Loop ---
    const gameLoop = () => {
      // 1. Update state (mutate refs)
      if (shake.current > 0) {
        shake.current *= 0.9;
      }

      particles.current = particles.current
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          alpha: p.alpha - 0.02,
        }))
        .filter(p => p.alpha > 0);

      // 2. Draw everything
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      if (shake.current > 0.5) {
        const dx = (Math.random() - 0.5) * shake.current;
        const dy = (Math.random() - 0.5) * shake.current;
        ctx.translate(dx, dy);
      }

      // Draw target
      if (target.current) {
        ctx.beginPath();
        ctx.arc(target.current.x, target.current.y, target.current.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Draw particles
      particles.current.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });

      // Draw crosshair
      const { x, y } = mousePos.current;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 10, y);
      ctx.lineTo(x + 10, y);
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x, y + 10);
      ctx.stroke();

      ctx.restore();

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;

      if (!target.current) {
        onMiss();
        shake.current = 15;
        return;
      }

      const distance = Math.sqrt((mousePos.current.x - target.current.x) ** 2 + (mousePos.current.y - target.current.y) ** 2);

      if (distance <= target.current.radius) {
        const reactionTime = performance.now() - target.current.spawnTime;
        onTargetHit(reactionTime);

        // Create particle explosion on hit
        for (let i = 0; i < 20; i++) {
          particles.current.push({
            x: target.current.x,
            y: target.current.y,
            radius: Math.random() * 3 + 1,
            vx: (Math.random() - 0.5) * (Math.random() * 8),
            vy: (Math.random() - 0.5) * (Math.random() * 8),
            alpha: 1,
            color: '#67e8f9',
          });
        }
        
        target.current = null;
        spawnTarget();
      } else {
        onMiss();
        shake.current = 15;
      }
    };

    // --- Setup & Teardown ---
    setTimer(gameDuration);
    spawnTarget();
    gameLoop();

    timerIntervalId.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalId.current);
          onGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (timerIntervalId.current) clearInterval(timerIntervalId.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [gameDuration, onGameEnd, onMiss, onTargetHit, setTimer, spawnTarget]);

  // Resize observer to keep canvas sharp
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    });
    resizeObserver.observe(parent);
    
    // Set initial size
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    return () => resizeObserver.disconnect();
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full cursor-none" />;
};

export default GameCanvas;
