import { useState, useEffect } from "react";
import { GameState } from "@shared/schema";
import { AnimatedProgress, ProgressCelebration } from "./AnimatedProgress";

interface LevelInfoCardsProps {
  gameState: GameState;
}

export function LevelInfoCards({ gameState }: LevelInfoCardsProps) {
  // Celebration animations when level progress reaches 100%
  const [celebratingLevel, setCelebratingLevel] = useState<number | null>(null);
  const [prevLevelProgress, setPrevLevelProgress] = useState<number[]>([...gameState.levelProgress]);
  
  // Detect level completion milestone
  useEffect(() => {
    // Create a deep copy to check if values actually changed
    const hasChanged = JSON.stringify(prevLevelProgress) !== JSON.stringify(gameState.levelProgress);
    
    if (hasChanged) {
      for (let i = 0; i < gameState.levelProgress.length; i++) {
        if (
          gameState.levelProgress[i] >= 100 && 
          prevLevelProgress[i] < 100 &&
          celebratingLevel === null
        ) {
          setCelebratingLevel(i);
          
          // Reset celebration after animation
          const timer = setTimeout(() => {
            setCelebratingLevel(null);
          }, 2500);
          
          return () => clearTimeout(timer);
        }
      }
      
      // Only update the previous state if the values changed
      setPrevLevelProgress([...gameState.levelProgress]);
    }
  }, [gameState.levelProgress]);
  
  // Determine the status text for each level
  const getLevelStatus = (levelIndex: number) => {
    if (gameState.level === levelIndex) return 'Current Level';
    if (gameState.level > levelIndex) return 'Completed';
    return 'Locked';
  };
  
  // Get appropriate progress bar color based on progress and current level
  const getProgressBarColor = (levelIndex: number) => {
    if (gameState.level > levelIndex) return "bg-green-500"; // Completed level
    if (gameState.level === levelIndex) return "bg-primary"; // Current level
    return "bg-gray-300"; // Locked level
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Level 1: Awareness */}
      <div 
        className={`relative bg-white rounded-lg shadow-sm p-4 border-t-4 ${
          gameState.level === 0 
            ? 'border-primary' 
            : (gameState.level > 0 ? 'border-green-500' : 'border-gray-300')
        } transition-all duration-500 ${
          gameState.level === 0 ? 'scale-[1.02]' : 'scale-100'
        } ${celebratingLevel === 0 ? 'animate-pulse' : ''}`}
      >
        {/* Celebration overlay */}
        <ProgressCelebration 
          active={celebratingLevel === 0} 
          colors={['#4ade80', '#3b82f6', '#8b5cf6']}
        />
        
        <div className="flex items-center mb-2">
          <span className={`mr-2 ${
            gameState.level === 0 
              ? 'text-primary' 
              : (gameState.level > 0 ? 'text-green-500' : 'text-gray-500')
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-lightbulb ${
              gameState.level > 0 ? 'animate-bounce-subtle' : ''
            }`}>
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
              <path d="M9 18h6"/>
              <path d="M10 22h4"/>
            </svg>
          </span>
          <h3 className={`font-medium ${
            gameState.level === 0 ? 'text-gray-900' : 'text-gray-500'
          }`}>
            Level 1: Awareness
            {gameState.level > 0 && (
              <span className="ml-2 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </h3>
        </div>
        
        <p className={`text-sm ${gameState.level === 0 ? 'text-gray-900' : 'text-gray-500'}`}>
          Help your client understand what health insurance is and why it's important.
        </p>
        
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
            <span>{getLevelStatus(0)}</span>
            <span>{gameState.levelProgress[0]}% Complete</span>
          </div>
          <AnimatedProgress 
            value={gameState.levelProgress[0]} 
            barClassName={getProgressBarColor(0)}
            height="h-2"
            animated={true}
            showValue={false}
          />
        </div>
      </div>
      
      {/* Level 2: Enrollment */}
      <div 
        className={`relative bg-white rounded-lg shadow-sm p-4 border-t-4 ${
          gameState.level === 1 
            ? 'border-primary' 
            : (gameState.level > 1 ? 'border-green-500' : 'border-gray-300')
        } transition-all duration-500 ${
          gameState.level === 1 ? 'scale-[1.02]' : 'scale-100'
        } ${celebratingLevel === 1 ? 'animate-pulse' : ''}`}
      >
        {/* Celebration overlay */}
        <ProgressCelebration 
          active={celebratingLevel === 1} 
          colors={['#4ade80', '#3b82f6', '#8b5cf6']}
        />
        
        <div className="flex items-center mb-2">
          <span className={`mr-2 ${
            gameState.level === 1 
              ? 'text-primary' 
              : (gameState.level > 1 ? 'text-green-500' : 'text-gray-500')
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-clipboard-signature ${
              gameState.level > 1 ? 'animate-bounce-subtle' : ''
            }`}>
              <path d="M20 16V8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Z"/>
              <path d="M2 16V8a2 2 0 0 1 2-2"/>
              <path d="M14 8H9"/>
              <path d="M16 12h-4"/>
              <path d="M13 17c1 1 2 1 2.5.5s.5-1.5-.5-2.5c-1-1-2-1-2.5-.5s-.5 1.5.5 2.5Z"/>
            </svg>
          </span>
          <h3 className={`font-medium ${
            gameState.level === 1 ? 'text-gray-900' : 'text-gray-500'
          }`}>
            Level 2: Enrollment
            {gameState.level > 1 && (
              <span className="ml-2 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </h3>
        </div>
        
        <p className={`text-sm ${gameState.level === 1 ? 'text-gray-900' : 'text-gray-500'}`}>
          Guide your client through choosing and enrolling in an appropriate plan.
        </p>
        
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
            <span>{getLevelStatus(1)}</span>
            <span>{gameState.levelProgress[1]}% Complete</span>
          </div>
          <AnimatedProgress 
            value={gameState.levelProgress[1]} 
            barClassName={getProgressBarColor(1)}
            height="h-2"
            animated={true}
            showValue={false}
          />
        </div>
      </div>
      
      {/* Level 3: Utilization */}
      <div 
        className={`relative bg-white rounded-lg shadow-sm p-4 border-t-4 ${
          gameState.level === 2 
            ? 'border-primary' 
            : (gameState.level > 2 ? 'border-green-500' : 'border-gray-300')
        } transition-all duration-500 ${
          gameState.level === 2 ? 'scale-[1.02]' : 'scale-100'
        } ${celebratingLevel === 2 ? 'animate-pulse' : ''}`}
      >
        {/* Celebration overlay */}
        <ProgressCelebration 
          active={celebratingLevel === 2} 
          colors={['#4ade80', '#3b82f6', '#8b5cf6']}
        />
        
        <div className="flex items-center mb-2">
          <span className={`mr-2 ${
            gameState.level === 2 
              ? 'text-primary' 
              : (gameState.level > 2 ? 'text-green-500' : 'text-gray-500')
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-stethoscope">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
              <circle cx="20" cy="10" r="2"/>
            </svg>
          </span>
          <h3 className={`font-medium ${
            gameState.level === 2 ? 'text-gray-900' : 'text-gray-500'
          }`}>
            Level 3: Utilization
            {gameState.level > 2 && (
              <span className="ml-2 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </h3>
        </div>
        
        <p className={`text-sm ${gameState.level === 2 ? 'text-gray-900' : 'text-gray-500'}`}>
          Help your client effectively use their health insurance benefits.
        </p>
        
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
            <span>{getLevelStatus(2)}</span>
            <span>{gameState.levelProgress[2]}% Complete</span>
          </div>
          <AnimatedProgress 
            value={gameState.levelProgress[2]} 
            barClassName={getProgressBarColor(2)}
            height="h-2"
            animated={true}
            showValue={false}
          />
        </div>
      </div>
    </div>
  );
}
