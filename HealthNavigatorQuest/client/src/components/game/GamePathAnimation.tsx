import React, { useEffect, useState } from 'react';

interface GamePathAnimationProps {
  currentProgress: number;
  previousProgress?: number;
  steps?: number;
  className?: string;
  clientName?: string;
  showMovement?: boolean;
}

export function GamePathAnimation({
  currentProgress,
  previousProgress,
  steps = 10,
  className = '',
  clientName = 'Client',
  showMovement = true
}: GamePathAnimationProps) {
  const [position, setPosition] = useState(Math.floor((currentProgress / 100) * steps));
  const [prevPosition, setPrevPosition] = useState(Math.floor((previousProgress || currentProgress) / 100 * steps));
  const [isMoving, setIsMoving] = useState(false);
  const [moveDirection, setMoveDirection] = useState<'forward' | 'backward'>('forward');
  const [moveDistance, setMoveDistance] = useState(0);
  
  useEffect(() => {
    const newPosition = Math.floor((currentProgress / 100) * steps);
    
    if (previousProgress !== undefined && newPosition !== prevPosition) {
      // Determine if we're moving forward or backward
      const direction = newPosition > prevPosition ? 'forward' : 'backward';
      setMoveDirection(direction);
      setMoveDistance(Math.abs(newPosition - prevPosition));
      setIsMoving(true);
      
      // Animate movement
      setTimeout(() => {
        setPosition(newPosition);
        // After animation completes
        setTimeout(() => {
          setIsMoving(false);
          setPrevPosition(newPosition);
        }, 500);
      }, 100);
    } else {
      // No previous position, just set directly
      setPosition(newPosition);
      setPrevPosition(newPosition);
    }
  }, [currentProgress, previousProgress, steps, prevPosition]);
  
  // Generate path tiles
  const renderPathTiles = () => {
    const tiles = [];
    
    for (let i = 0; i < steps; i++) {
      const isCurrentPosition = i === position;
      const isSpecialTile = i % 3 === 0;
      
      tiles.push(
        <div 
          key={i}
          className={`
            relative h-12 w-16 rounded-md 
            ${isSpecialTile ? 'bg-primary/30' : 'bg-gray-100'} 
            ${isCurrentPosition ? 'ring-2 ring-offset-2 ring-primary' : ''}
            transition-all duration-200
          `}
        >
          {/* Tile content - could be an obstacle or bonus */}
          {isSpecialTile && (
            <div className="absolute inset-0 flex items-center justify-center text-primary text-xs">
              {i % 6 === 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              )}
            </div>
          )}
          
          {/* Tile number */}
          <div className="absolute bottom-1 right-1 text-xs text-gray-500">
            {i + 1}
          </div>
          
          {/* Client token on current position */}
          {isCurrentPosition && (
            <div 
              className={`
                absolute -top-8 left-1/2 transform -translate-x-1/2
                flex flex-col items-center
                ${isMoving ? (moveDirection === 'forward' ? 'animate-bounce-once' : 'animate-shake') : ''}
              `}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">
                  {clientName.charAt(0)}
                </span>
              </div>
              {showMovement && isMoving && (
                <div className="mt-1 text-xs font-medium bg-white px-2 py-1 rounded-full shadow">
                  {moveDirection === 'forward' ? `+${moveDistance}` : `-${moveDistance}`}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    return tiles;
  };
  
  return (
    <div className={`${className} relative`}>
      <div className="flex overflow-x-auto pb-10 pt-10 px-2 gap-1">
        {renderPathTiles()}
      </div>
      
      {/* Finish flag */}
      <div className="absolute right-0 top-0 -mt-2 -mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
      </div>
      
      {/* Start marker */}
      <div className="absolute left-0 top-0 -mt-2 -ml-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>
    </div>
  );
}

export function GameProgressBoard({
  currentProgress,
  previousProgress,
  levelName,
  clientName,
  className = '',
  showTitle = true,
  hasObstacles = true
}: {
  currentProgress: number;
  previousProgress?: number;
  levelName: string;
  clientName: string;
  className?: string;
  showTitle?: boolean;
  hasObstacles?: boolean;
}) {
  // Randomly place obstacles on the board
  const [obstacles, setObstacles] = useState<{position: number; type: 'delay' | 'tax' | 'setback'}[]>([]);
  
  useEffect(() => {
    if (hasObstacles) {
      // Generate 3 random obstacle positions (not at start or end)
      const positions: number[] = [];
      while (positions.length < 3) {
        const pos = Math.floor(Math.random() * 8) + 1; // Between 1 and 8 (not 0 or 9)
        if (!positions.includes(pos)) {
          positions.push(pos);
        }
      }
      
      const types: ('delay' | 'tax' | 'setback')[] = ['delay', 'tax', 'setback'];
      
      // Create obstacle objects
      const newObstacles = positions.map((pos, index) => ({
        position: pos,
        type: types[index % types.length]
      }));
      
      setObstacles(newObstacles);
    }
  }, [hasObstacles]);
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      {showTitle && (
        <h3 className="font-medium mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map mr-2">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" x2="9" y1="3" y2="18"/>
            <line x1="15" x2="15" y1="6" y2="21"/>
          </svg>
          {levelName} Progress Path
        </h3>
      )}
      
      <GamePathAnimation 
        currentProgress={currentProgress} 
        previousProgress={previousProgress}
        clientName={clientName}
      />
      
      {hasObstacles && (
        <div className="mt-3 text-xs text-gray-500">
          <p className="font-medium">Watch out for:</p>
          <div className="flex gap-4 mt-1">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              <span>Obstacles</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              <span>Bonuses</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add to your index.css or create with style tag
const cssAnimations = `
@keyframes bounceOnce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-20px) translateX(-50%);
  }
  60% {
    transform: translateY(-10px) translateX(-50%);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(-50%);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-55%);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(-45%);
  }
}

.animate-bounce-once {
  animation: bounceOnce 1s ease-in-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
`;

export function addAnimationStyles() {
  // Add these animations to your CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = cssAnimations;
  document.head.appendChild(styleElement);
}