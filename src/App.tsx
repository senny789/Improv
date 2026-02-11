import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dice5, RotateCcw, Zap, Play, Pause, TimerReset } from "lucide-react";

import { Button } from "./components/ui/button";
import { GameCard } from "./components/GameCard";
import { Timer } from "./components/Timer";
import { LOCATIONS, CHARACTERS, CONFLICTS, TWISTS } from "./data/prompts";
import { cn } from "./lib/utils";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

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
  const [totalActors, setTotalActors] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [resetTimer, setResetTimer] = useState(false);
  const [actorNames, setActorNames] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);
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
    if (!(totalActors && duration && actorNames.length === totalActors)) {
      setShowError(true);
      return;
    }
    setShowError(false);
    generateScene();
    setGameState("PLAYING");
  };

  const triggerTwist = () => {
    if (!scene) return;
    const twist = getRandom(TWISTS);
    setScene((prev) => (prev ? { ...prev, twist } : null));
    setTwistActive(true);
  };
  const handleResetTimer = () => {
    setResetTimer(!resetTimer);
    setIsTimerActive(false);
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
            <h1 className="text-2xl font-bold  flex items-center gap-2">
              <img
                src="/improv-it.png"
                alt="Improv It"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              <span className="text-xl  font-normal text-purple-500">
                IMPROV-IT
              </span>
            </h1>
          </div>
          {gameState === "PLAYING" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setGameState("MENU")}
              className="bg-white/10 hover:bg-white/20 border-0 text-white"
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 items-start">
                    <label htmlFor="actors" className="text-xl font-bold">
                      Total Actors
                    </label>
                    <Select
                      // value={totalActors.toString()}
                      onValueChange={(value) => setTotalActors(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Total Actors" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="1">1 actor</SelectItem>
                        <SelectItem value="2">2 actors</SelectItem>
                        <SelectItem value="3">3 actors</SelectItem>
                        <SelectItem value="4">4 actors</SelectItem>
                        <SelectItem value="5">5 actors</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <label htmlFor="duration" className="text-xl font-bold">
                      Duration
                    </label>
                    <Select
                      onValueChange={(value) => setDuration(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a duration" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="1">1 minute</SelectItem>
                        <SelectItem value="2">2 minutes</SelectItem>
                        <SelectItem value="3">3 minutes</SelectItem>
                        <SelectItem value="4">4 minutes</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  {Array.from({ length: totalActors }).map((_, index) => (
                    <div
                      key={index}
                      className="grow flex flex-col gap-2 items-start"
                    >
                      <label
                        htmlFor={`actor-${index}`}
                        className="text-xl font-bold"
                      >
                        Actor {index + 1}
                      </label>
                      <Input
                        id={`actor-${index}`}
                        type="text"
                        placeholder={`Enter name of actor ${index + 1}`}
                        value={actorNames[index] || ""}
                        onChange={(e) => {
                          const newNames = [...actorNames];
                          newNames[index] = e.target.value;
                          setActorNames(newNames);
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  {showError && (
                    <p className="text-red-500 text-center font-bold">
                      Please select both total actors and duration and enter
                      names for all actors.
                    </p>
                  )}
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
                    key={resetTimer ? "reset" : "active"}
                    isActive={isTimerActive}
                    duration={duration * 60} // 3 minutes
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
                        {actorNames.map((actorName, index) => (
                          <GameCard
                            key={index}
                            type="character"
                            title={`${actorName}`}
                            content={scene.characters[index]}
                          />
                        ))}
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
                    className="border-slate-700 hover:bg-slate-800 text-black"
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
                    onClick={handleResetTimer}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <TimerReset className="w-4 h-4 mr-2" />
                    Reset Timer
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
          <p>IMPROV-IT &copy; 2026</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
