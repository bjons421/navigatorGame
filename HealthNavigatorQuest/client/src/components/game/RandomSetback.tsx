import React, { useState, useEffect } from 'react';
import { GameState } from '@shared/schema';

export interface Setback {
  id: number;
  title: string;
  description: string;
  healthImpact: number;
  progressImpact: number;
  probability: number; // 0-100, percentage chance of occurring
  levels: number[]; // Which level(s) this setback can appear in [0,1,2]
  displayDuration?: number; // How long to display in ms before auto-continuing
}

const setbacks: Setback[] = [
  // Level 0: Awareness Setbacks - Mostly mild
  {
    id: 1,
    title: "Information Overload",
    description: "Your client feels overwhelmed by all the health insurance information and takes a break from the process.",
    healthImpact: -5,
    progressImpact: -10,
    probability: 20,
    levels: [0]
  },
  {
    id: 2,
    title: "Misunderstood Advice",
    description: "Your client misinterpreted some key information, causing confusion and delay.",
    healthImpact: -3,
    progressImpact: -8,
    probability: 25,
    levels: [0]
  },
  {
    id: 3,
    title: "Budget Crisis",
    description: "A surprise car repair bill has your client questioning if they can afford health insurance at all.",
    healthImpact: -8,
    progressImpact: -15,
    probability: 15,
    levels: [0, 1, 2]
  },
  {
    id: 4,
    title: "Misinformation",
    description: "Your client heard inaccurate information from a friend that contradicts your advice.",
    healthImpact: -4,
    progressImpact: -12,
    probability: 20,
    levels: [0]
  },
  
  // Level 1: Enrollment Setbacks - More impactful
  {
    id: 5,
    title: "Website Outage",
    description: "The healthcare marketplace website is down for maintenance during a critical enrollment window.",
    healthImpact: -7,
    progressImpact: -15,
    probability: 15,
    levels: [1]
  },
  {
    id: 6,
    title: "Missing Documentation",
    description: "Your client can't find their income verification documents needed for the application.",
    healthImpact: -5,
    progressImpact: -20,
    probability: 20,
    levels: [1]
  },
  {
    id: 7,
    title: "Income Fluctuation",
    description: "Your client's hours were cut at work, changing their subsidy eligibility and requiring a new application.",
    healthImpact: -10,
    progressImpact: -25,
    probability: 15,
    levels: [1]
  },
  {
    id: 8,
    title: "Identity Verification Issue",
    description: "The enrollment system couldn't verify your client's identity, requiring additional steps.",
    healthImpact: -8,
    progressImpact: -18,
    probability: 18,
    levels: [1]
  },
  
  // Level 2: Utilization Setbacks - Most severe
  {
    id: 9,
    title: "Surprise Bill",
    description: "Your client received an unexpected medical bill for a service they thought was covered.",
    healthImpact: -15,
    progressImpact: -20,
    probability: 25,
    levels: [2]
  },
  {
    id: 10,
    title: "Medication Not Covered",
    description: "Your client discovered their critical medication is not on their plan's formulary.",
    healthImpact: -20,
    progressImpact: -15,
    probability: 20,
    levels: [2]
  },
  {
    id: 11,
    title: "Prior Authorization Denied",
    description: "Your client's insurance denied prior authorization for a recommended procedure.",
    healthImpact: -18,
    progressImpact: -25,
    probability: 20,
    levels: [2]
  },
  {
    id: 12,
    title: "Network Provider Left",
    description: "Your client's primary doctor is no longer in-network with their insurance plan.",
    healthImpact: -12,
    progressImpact: -22,
    probability: 18,
    levels: [2]
  },
  
  // Cross-level severe setbacks - less common but more impactful
  {
    id: 13,
    title: "Medical Emergency",
    description: "Your client had to visit the emergency room, incurring unexpected costs and stress.",
    healthImpact: -25,
    progressImpact: -20,
    probability: 10,
    levels: [0, 1, 2]
  },
  {
    id: 14,
    title: "Job Loss",
    description: "Your client was laid off and now must figure out new health insurance options.",
    healthImpact: -20,
    progressImpact: -30,
    probability: 8,
    levels: [0, 1, 2]
  },
  {
    id: 15,
    title: "Housing Insecurity",
    description: "Your client is facing possible eviction and health insurance has become a lower priority.",
    healthImpact: -15,
    progressImpact: -25,
    probability: 12,
    levels: [0, 1, 2]
  }
];

interface RandomSetbackProps {
  gameState: GameState;
  isVisible: boolean;
  onClose: () => void;
  onApplySetback: (healthImpact: number, progressImpact: number) => void;
}

export function RandomSetback({ 
  gameState, 
  isVisible, 
  onClose, 
  onApplySetback 
}: RandomSetbackProps) {
  const [currentSetback, setCurrentSetback] = useState<Setback | null>(null);
  const [shouldAppear, setShouldAppear] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  // Determine if a setback should appear based on probability
  useEffect(() => {
    if (isVisible) {
      // Filter setbacks available for this level
      const availableSetbacks = setbacks.filter(setback => 
        setback.levels.includes(gameState.level)
      );
      
      // Randomly decide if a setback should appear
      const randomValue = Math.random() * 100;
      if (availableSetbacks.length > 0) {
        // Create a probability pool based on setback weights
        let probabilityPool: Setback[] = [];
        availableSetbacks.forEach(setback => {
          // Add entries to pool based on probability (higher prob = more entries)
          const entries = Math.ceil(setback.probability / 5); // Adjust divisor to control frequency
          for (let i = 0; i < entries; i++) {
            probabilityPool.push(setback);
          }
        });
        
        // Randomly select from pool if we should show a setback
        if (randomValue < 30) { // 30% chance of setback between turns
          const randomIndex = Math.floor(Math.random() * probabilityPool.length);
          setCurrentSetback(probabilityPool[randomIndex]);
          setShouldAppear(true);
          setCountdown(5);
        } else {
          onClose(); // No setback, close immediately
        }
      } else {
        onClose(); // No setbacks available, close
      }
    } else {
      setShouldAppear(false);
      setCurrentSetback(null);
    }
  }, [isVisible, gameState.level, onClose]);
  
  // Auto-continue countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (shouldAppear && currentSetback && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && shouldAppear) {
      // Apply the setback and close
      if (currentSetback) {
        onApplySetback(currentSetback.healthImpact, currentSetback.progressImpact);
      }
      setShouldAppear(false);
      onClose();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [shouldAppear, countdown, currentSetback, onApplySetback, onClose]);
  
  if (!shouldAppear || !currentSetback) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full transform transition-all animate-bounce-in">
        <div className="bg-red-500 text-white px-6 py-3 rounded-t-lg flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle mr-2">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <path d="M12 9v4"/>
              <path d="M12 17h.01"/>
            </svg>
            {currentSetback.title}
          </h3>
          <span className="text-sm bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center">
            {countdown}
          </span>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-4">{currentSetback.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <p className="text-red-700 font-medium text-sm">Health Impact</p>
              <p className="text-red-800 text-lg font-bold">{currentSetback.healthImpact}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="text-blue-700 font-medium text-sm">Progress Impact</p>
              <p className="text-blue-800 text-lg font-bold">{currentSetback.progressImpact}</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              onApplySetback(currentSetback.healthImpact, currentSetback.progressImpact);
              setShouldAppear(false);
              onClose();
            }}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Continue ({countdown})
          </button>
        </div>
      </div>
    </div>
  );
}

// Add to your index.css
const cssAnimations = `
@keyframes bounceIn {
  0%, 20%, 40%, 60%, 80%, 100% {
    transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
  0% {
    opacity: 0;
    transform: scale3d(.3, .3, .3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(.9, .9, .9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(.97, .97, .97);
  }
  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

.animate-bounce-in {
  animation: bounceIn 0.75s;
}
`;

export function addSetbackAnimationStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = cssAnimations;
  document.head.appendChild(styleElement);
}