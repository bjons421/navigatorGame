import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedProgressProps {
  value: number;
  maxValue?: number;
  showValue?: boolean;
  className?: string;
  valueClassName?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  barClassName?: string;
  height?: string;
  animated?: boolean;
  duration?: number;
  direction?: 'horizontal' | 'vertical';
  valuePosition?: 'inside' | 'outside' | 'none';
  threshold?: number;
  onThresholdReached?: () => void;
}

export function AnimatedProgress({
  value,
  maxValue = 100,
  showValue = true,
  className = '',
  valueClassName = '',
  valuePrefix = '',
  valueSuffix = '%',
  barClassName = 'bg-secondary',
  height = 'h-4',
  animated = true,
  duration = 700,
  direction = 'horizontal',
  valuePosition = 'outside',
  threshold = 100,
  onThresholdReached
}: AnimatedProgressProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);

  // Normalize value to percentage
  const percentage = Math.min(Math.max(0, value), maxValue) / maxValue * 100;
  const displayPercentage = Math.min(Math.max(0, displayValue), maxValue) / maxValue * 100;
  
  // Set initial animation values
  useEffect(() => {
    if (value !== prevValue) {
      setIsAnimating(true);
      setPrevValue(value);
      
      // Staggered animation starts from previous value
      const timeout = setTimeout(() => {
        setDisplayValue(value);
      }, 50);
      
      // Animation completed
      const animationEnd = setTimeout(() => {
        setIsAnimating(false);
        
        // Check if threshold has been reached
        if (value >= threshold && !hasReachedThreshold) {
          setHasReachedThreshold(true);
          if (onThresholdReached) {
            onThresholdReached();
          }
        }
      }, duration + 100);
      
      return () => {
        clearTimeout(timeout);
        clearTimeout(animationEnd);
      };
    }
  }, [value, prevValue, duration, threshold, hasReachedThreshold, onThresholdReached]);
  
  // Reset threshold reached if value falls below threshold
  useEffect(() => {
    if (value < threshold && hasReachedThreshold) {
      setHasReachedThreshold(false);
    }
  }, [value, threshold, hasReachedThreshold]);
  
  // Determine styles based on direction
  const containerClasses = cn(
    'relative overflow-hidden rounded-full bg-gray-200',
    height,
    className
  );
  
  const progressBarClasses = cn(
    barClassName,
    animated ? 'transition-all ease-out' : '',
    direction === 'horizontal' ? 'h-full' : 'w-full absolute bottom-0',
    isAnimating && animated ? 'duration-700' : 'duration-0'
  );
  
  const progressStyle = direction === 'horizontal' 
    ? { width: `${displayPercentage}%` } 
    : { height: `${displayPercentage}%` };

  const valueText = `${valuePrefix}${Math.round(displayValue)}${valueSuffix}`;

  // Determine the visualization based on value position
  return (
    <div className="relative">
      {showValue && valuePosition === 'outside' && (
        <div className={cn("text-sm font-medium text-right mb-1", valueClassName)}>
          {valueText}
        </div>
      )}
      <div className={containerClasses}>
        <div 
          className={progressBarClasses} 
          style={{
            ...progressStyle,
            transitionDuration: `${duration}ms`
          }}
        >
          {showValue && valuePosition === 'inside' && (
            <span className={cn("text-xs text-white px-2 leading-loose", valueClassName)}>
              {valueText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function AnimatedSegmentedProgress({
  segments,
  currentSegment,
  animated = true,
  className = '',
  activeSegmentClass = 'bg-primary',
  inactiveSegmentClass = 'bg-gray-300',
  segmentGap = 'space-x-1',
  height = 'h-2',
  labels = [],
  labelPosition = 'bottom',
  onSegmentClick,
}: {
  segments: number;
  currentSegment: number;
  animated?: boolean;
  className?: string;
  activeSegmentClass?: string;
  inactiveSegmentClass?: string;
  segmentGap?: string;
  height?: string;
  labels?: string[];
  labelPosition?: 'top' | 'bottom';
  onSegmentClick?: (index: number) => void;
}) {
  const [animationComplete, setAnimationComplete] = useState(true);
  
  useEffect(() => {
    if (animated) {
      setAnimationComplete(false);
      const timeout = setTimeout(() => {
        setAnimationComplete(true);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [currentSegment, animated]);

  return (
    <div className={cn("flex flex-col", className)}>
      {labels && labels.length > 0 && labelPosition === 'top' && (
        <div className={`flex justify-between text-xs text-gray-500 mb-1 ${segmentGap}`}>
          {labels.map((label, i) => (
            <span key={i} className={i === currentSegment ? 'font-medium text-primary' : ''}>
              {label}
            </span>
          ))}
        </div>
      )}
      
      <div className={`flex ${segmentGap}`}>
        {Array.from({ length: segments }).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "flex-1 rounded-md transition-all duration-700",
              height,
              i === 0 ? "rounded-l-full" : "",
              i === segments - 1 ? "rounded-r-full" : "",
              i <= currentSegment ? activeSegmentClass : inactiveSegmentClass,
              onSegmentClick ? "cursor-pointer" : ""
            )}
            style={{
              transform: animated && !animationComplete && i === currentSegment 
                ? 'scaleX(0)' 
                : 'scaleX(1)',
              transformOrigin: 'left',
              transition: 'transform 0.7s ease-out'
            }}
            onClick={() => onSegmentClick && onSegmentClick(i)}
          />
        ))}
      </div>
      
      {labels && labels.length > 0 && labelPosition === 'bottom' && (
        <div className={`flex justify-between text-xs text-gray-500 mt-1 ${segmentGap}`}>
          {labels.map((label, i) => (
            <span key={i} className={i === currentSegment ? 'font-medium text-primary' : ''}>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Stars that appear when progress reaches certain levels
export function AnimatedProgressStars({
  value,
  maxValue = 100,
  thresholds = [25, 50, 75, 100],
  className = '',
}: {
  value: number;
  maxValue?: number;
  thresholds?: number[];
  className?: string;
}) {
  const percentage = (value / maxValue) * 100;
  const achievedThresholds = thresholds.filter(t => percentage >= t);
  
  return (
    <div className={cn("flex", className)}>
      {thresholds.map((threshold, i) => (
        <div key={i} className="relative">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={percentage >= threshold ? "currentColor" : "none"}
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={cn(
              "transition-all duration-500", 
              percentage >= threshold ? "text-yellow-400 scale-110" : "text-gray-300",
              i === achievedThresholds.length - 1 && achievedThresholds.length > 0 ? "animate-pulse" : "",
            )}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          {percentage >= threshold && achievedThresholds.length - 1 === i && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// Sparkles/particles animation when milestone is achieved
export function ProgressCelebration({
  active,
  duration = 2000,
  particleCount = 30,
  colors = ['#FFD700', '#FFC0CB', '#87CEFA', '#98FB98', '#DDA0DD'],
  className = '',
}: {
  active: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  className?: string;
}) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    rotation: number;
    opacity: number;
  }>>([]);
  
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (active && !isActive) {
      setIsActive(true);
      
      // Generate random particles
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 5 + Math.random() * 15,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        opacity: 0.6 + Math.random() * 0.4
      }));
      
      setParticles(newParticles);
      
      // End animation after duration
      const timeout = setTimeout(() => {
        setIsActive(false);
        setParticles([]);
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [active, isActive, duration, particleCount, colors]);
  
  if (!isActive) return null;
  
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map(particle => (
        <div 
          key={particle.id}
          className="absolute transform animate-float"
          style={{
            top: `${particle.y}%`,
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            opacity: particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `float ${duration}ms linear forwards`
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: rotate(${360 + Math.random() * 720}deg) translate(${-50 - Math.random() * 100}px, ${-100 - Math.random() * 150}px);
            opacity: 0;
          }
        }
        `
      }} />
    </div>
  );
}