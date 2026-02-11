import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface GameCardProps {
  title: string;
  content: string;
  type: "location" | "character" | "conflict" | "twist";
  className?: string;
}

export function GameCard({ title, content, type, className }: GameCardProps) {
  const gradients = {
    location: "from-blue-500/20 to-purple-500/20 border-blue-200/20",
    character: "from-green-500/20 to-emerald-500/20 border-green-200/20",
    conflict: "from-orange-500/20 to-red-500/20 border-orange-200/20",
    twist: "from-pink-500/20 to-rose-500/20 border-pink-200/20",
  };

  const textColors = {
    location: "text-blue-200",
    character: "text-green-200",
    conflict: "text-orange-200",
    twist: "text-pink-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 backdrop-blur-sm",
        gradients[type],
        className,
      )}
    >
      <div className="relative z-10">
        <h3
          className={cn(
            "mb-2 text-sm font-medium uppercase tracking-wider opacity-70",
            textColors[type],
          )}
        >
          {title}
        </h3>
        <p className="text-xl font-semibold leading-relaxed text-white md:text-2xl">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
