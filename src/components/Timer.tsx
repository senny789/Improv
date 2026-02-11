import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Timer as TimerIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface TimerProps {
  isActive: boolean;
  duration?: number; // in seconds
  onComplete?: () => void;
  className?: string;
}

export function Timer({
  isActive,
  duration = 120,
  onComplete,
  className,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, isActive]); // Reset when duration changes or reacitvated

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isWarning = timeLeft < 30; // Last 30 seconds
  const isCritical = timeLeft < 10; // Last 10 seconds

  return (
    <div
      className={cn(
        "relative flex items-center gap-2 font-mono text-2xl font-bold transition-colors overflow-hidden rounded-md px-4 py-2 bg-black/20",
        isCritical
          ? "text-red-500 animate-pulse"
          : isWarning
            ? "text-orange-400"
            : "text-white",
        className,
      )}
    >
      <TimerIcon className="h-6 w-6" />
      <span>{formatTime(timeLeft)}</span>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
        <motion.div
          className={cn("h-full", isCritical ? "bg-red-500" : "bg-primary")}
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / duration) * 100}%` }}
          transition={{ ease: "linear", duration: 1 }}
        />
      </div>
    </div>
  );
}
