import { useState, useEffect } from "react";
import { GameState } from "@shared/schema";
import { getLevelName } from "@/lib/gameData";
import { 
  AnimatedProgress, 
  AnimatedSegmentedProgress,
  AnimatedProgressStars,
  ProgressCelebration
} from "./AnimatedProgress";

interface StatusBarProps {
  gameState: GameState;
  clientName: string;
}

export function StatusBar({ gameState, clientName }: StatusBarProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevScore, setPrevScore] = useState(gameState.score);
  const [scoreThreshold, setScoreThreshold] = useState(50);
  
  // Detect score milestone achieved
  useEffect(() => {
    if (gameState.score > prevScore) {
      // Check if we've crossed a milestone (every 50 points)
      const prevMilestone = Math.floor(prevScore / 50) * 50;
      const currentMilestone = Math.floor(gameState.score / 50) * 50;
      
      if (currentMilestone > prevMilestone) {
        setScoreThreshold(currentMilestone + 50);
        setShowCelebration(true);
        
        // Reset celebration after animation
        const timer = setTimeout(() => {
          setShowCelebration(false);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
      
      setPrevScore(gameState.score);
    }
  }, [gameState.score, prevScore]);
  
  // Health bar color classes based on health value
  const getHealthBarColor = () => {
    if (gameState.clientHealth >= 75) return "bg-green-500";
    if (gameState.clientHealth >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  // Level names for segmented progress
  const levelNames = ["Awareness", "Enrollment", "Utilization"];

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 relative">
      {/* Celebration animation overlay */}
      <ProgressCelebration active={showCelebration} className="z-10" />
      
      <div className="w-full md:w-1/3">
        <div className="flex items-center mb-1">
          <span className="text-warning mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
          <h3 className="font-medium text-gray-900">Client: <span>{clientName}</span></h3>
        </div>
        
        <div className="flex items-center mb-2">
          <span className="text-primary mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </span>
          <h3 className="font-medium text-gray-900">Score: <span>{gameState.score}</span></h3>
        </div>
        
        {/* Score progress bar */}
        <div className="flex items-center">
          <AnimatedProgress 
            value={gameState.score} 
            maxValue={scoreThreshold}
            showValue={false}
            className="w-full"
            barClassName="bg-gradient-to-r from-blue-500 to-purple-500"
            height="h-2"
          />
          <AnimatedProgressStars 
            value={gameState.score % 50} 
            maxValue={50}
            thresholds={[10, 20, 30, 40, 50]}
            className="ml-2 space-x-0" 
          />
        </div>
      </div>
      
      <div className="w-full md:w-1/3">
        <h3 className="font-medium text-center mb-2">Turn: <span className="text-primary">{gameState.turn}</span></h3>
        
        {/* Animated level progress */}
        <AnimatedSegmentedProgress 
          segments={3}
          currentSegment={gameState.level}
          labels={levelNames}
          className="w-full"
          activeSegmentClass="bg-gradient-to-r from-primary to-blue-400"
          labelPosition="bottom"
        />
      </div>
      
      <div className="w-full md:w-1/3">
        <div className="mb-1 flex justify-between items-center">
          <h3 className="font-medium">Client Health</h3>
        </div>
        
        {/* Animated health bar */}
        <AnimatedProgress 
          value={gameState.clientHealth}
          animated={true}
          barClassName={getHealthBarColor()}
          duration={800}
          height="h-6"
          valuePosition="inside"
          valueClassName="text-white font-medium"
        />
        
        {/* Level progress bar */}
        <div className="mt-2">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>Level Progress:</span>
            <span>{gameState.levelProgress[gameState.level]}%</span>
          </div>
          <AnimatedProgress 
            value={gameState.levelProgress[gameState.level]}
            animated={true}
            barClassName="bg-gradient-to-r from-primary to-blue-400"
            height="h-3"
            showValue={false}
          />
        </div>
      </div>
    </div>
  );
}
