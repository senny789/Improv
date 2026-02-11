import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dice5, RotateCcw, Zap, Play, Pause } from "lucide-react";

import { Button } from "./components/ui/button";
import { GameCard } from "./components/GameCard";
import { Timer } from "./components/Timer";
import { LOCATIONS, CHARACTERS, CONFLICTS, TWISTS } from "./data/prompts";
import { cn } from "./lib/utils";

// Types
type GameState = "MENU" | "PLAYING";

interface SceneData {
  location: string;
  characters: string[];
  conflict: string;
  twist: string | null;
}

function App() {
  const [gameState, setGameState] = useState<GameState>("MENU");
  const [scene, setScene] = useState<SceneData | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [twistActive, setTwistActive] = useState(false);

  // Helper to get random item
  const getRandom = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  // Generate a new scene
  const generateScene = useCallback(() => {
    const newScene: SceneData = {
      location: getRandom(LOCATIONS),
      characters: [getRandom(CHARACTERS), getRandom(CHARACTERS)],
      conflict: getRandom(CONFLICTS),
      twist: null,
    };

    // Ensure unique characters
    while (newScene.characters[0] === newScene.characters[1]) {
      newScene.characters[1] = getRandom(CHARACTERS);
    }

    setScene(newScene);
    setTwistActive(false);
    setIsTimerActive(true);
  }, []);

  const startGame = () => {
    generateScene();
    setGameState("PLAYING");
  };

  const triggerTwist = () => {
    if (!scene) return;
    const twist = getRandom(TWISTS);
    setScene((prev) => (prev ? { ...prev, twist } : null));
    setTwistActive(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <Dice5 className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              ImprovGen
            </h1>
          </div>
          {gameState === "PLAYING" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setGameState("MENU")}
              className="bg-white/10 hover:bg-white/20 border-0"
            >
              Exit Game
            </Button>
          )}
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {gameState === "MENU" ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="text-center space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                    Ready to <span className="text-purple-400">Act?</span>
                  </h2>
                  <p className="text-xl text-slate-400 max-w-lg mx-auto">
                    Generate random scenes, characters, and conflicts for your
                    improv practice or party game.
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={startGame}
                    className="h-16 px-8 text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-500/20"
                  >
                    <Play className="w-6 h-6 mr-2 fill-current" />
                    Start Scene
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-2xl mx-auto space-y-8"
              >
                {/* Timer Section */}
                <div className="flex justify-center mb-8">
                  <Timer
                    isActive={isTimerActive}
                    duration={180} // 3 minutes
                    onComplete={() => setIsTimerActive(false)}
                    className="w-full max-w-md"
                  />
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {scene && (
                    <>
                      <GameCard
                        type="location"
                        title="Location"
                        content={scene.location}
                        className="col-span-1"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GameCard
                          type="character"
                          title="Character A"
                          content={scene.characters[0]}
                        />
                        <GameCard
                          type="character"
                          title="Character B"
                          content={scene.characters[1]}
                        />
                      </div>
                      <GameCard
                        type="conflict"
                        title="The Conflict"
                        content={scene.conflict}
                      />

                      <AnimatePresence>
                        {scene.twist && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <GameCard
                              type="twist"
                              title="THE TWIST"
                              content={scene.twist}
                              className="border-pink-500/50 bg-pink-500/10"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap justify-center gap-4 pt-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsTimerActive(!isTimerActive)}
                    className="border-slate-700 hover:bg-slate-800"
                  >
                    {isTimerActive ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {isTimerActive ? "Pause Timer" : "Resume Timer"}
                  </Button>

                  <Button
                    variant="default"
                    size="lg"
                    onClick={triggerTwist}
                    disabled={twistActive}
                    className={cn(
                      "bg-pink-600 hover:bg-pink-500 text-white transition-all",
                      twistActive && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Throw a Twist!
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={generateScene}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Scene
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>ImprovGen &copy; 2026</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
