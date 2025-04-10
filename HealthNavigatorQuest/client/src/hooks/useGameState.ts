import { useCallback, useState, useEffect } from 'react';
import { GameState, GameEvent, EventOption, Client } from '@shared/schema';
import { 
  getInitialGameState, 
  getClient, 
  getLevelName,
  getEvent
} from '@/lib/gameData';
import { generateQuestion } from '@/lib/questionGenerator';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { addSetbackAnimationStyles } from '@/components/game/RandomSetback';
import { addAnimationStyles } from '@/components/game/GamePathAnimation';

// Initialize animation styles
addSetbackAnimationStyles();
addAnimationStyles();

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [loading, setLoading] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [selectedOption, setSelectedOption] = useState<EventOption | null>(null);
  const [client, setClient] = useState<Client>(getClient(gameState.clientId));
  const [showHelp, setShowHelp] = useState(false);
  const [showSetback, setShowSetback] = useState(false);
  const [previousProgress, setPreviousProgress] = useState<number[]>([0, 0, 0]);
  const { toast } = useToast();

  // Initialize game
  const initGame = useCallback((clientId: number = 1) => {
    const initialState = getInitialGameState(clientId);
    setGameState(initialState);
    setClient(getClient(clientId));
    generateEvent(initialState);
    setShowOutcome(false);
    setSelectedOption(null);
    setPreviousProgress([0, 0, 0]);
  }, []);

  // Generate a new event
  const generateEvent = useCallback((state: GameState = gameState) => {
    // Create a copy of state with the client object included
    const stateWithClient = {
      ...state,
      client: client
    };
    
    // Use our question generator to create a random event
    const event = generateQuestion(stateWithClient);
    setCurrentEvent(event);
  }, [gameState, client]);

  // Handle selecting an option
  const selectOption = useCallback((option: EventOption) => {
    if (!currentEvent) return;

    setSelectedOption(option);
    setShowOutcome(true);

    // Update game state based on the selected option
    setGameState(prevState => {
      // Calculate new values with boundaries
      const newHealth = Math.max(0, Math.min(100, prevState.clientHealth + option.healthEffect));
      
      // Store previous progress for animation comparison
      setPreviousProgress([...prevState.levelProgress]);
      
      // Update level progress
      const newLevelProgress = [...prevState.levelProgress];
      // Increase progress by 15-30% depending on score
      const progressIncrease = Math.floor(15 + (option.scoreEffect / 5));
      newLevelProgress[prevState.level] = Math.min(100, newLevelProgress[prevState.level] + progressIncrease);
      
      return {
        ...prevState,
        clientHealth: newHealth,
        score: prevState.score + option.scoreEffect,
        completedEvents: [...prevState.completedEvents, currentEvent.id],
        levelProgress: newLevelProgress
      };
    });
  }, [currentEvent]);

  // Apply a random setback to the game state
  const applySetback = useCallback((healthImpact: number, progressImpact: number) => {
    setGameState(prevState => {
      // Store previous progress for animation comparison
      setPreviousProgress([...prevState.levelProgress]);
      
      // Calculate new values with boundaries
      const newHealth = Math.max(0, Math.min(100, prevState.clientHealth + healthImpact));
      
      // Update level progress (can go backwards)
      const newLevelProgress = [...prevState.levelProgress];
      newLevelProgress[prevState.level] = Math.max(0, newLevelProgress[prevState.level] + progressImpact);
      
      // If health drops to 0, game over
      if (newHealth <= 0) {
        toast({
          title: "Game Over",
          description: "Your client's situation has become too difficult to manage.",
          variant: "destructive"
        });
      }
      
      // Show toast for significant setbacks
      if (healthImpact <= -15 || progressImpact <= -20) {
        toast({
          title: "Major Setback!",
          description: "Your client is facing a serious challenge.",
          variant: "destructive"
        });
      }
      
      return {
        ...prevState,
        clientHealth: newHealth,
        levelProgress: newLevelProgress
      };
    });
  }, [toast]);

  // Continue to next turn
  const continueTurn = useCallback(() => {
    if (!selectedOption) return;

    setGameState(prevState => {
      const newTurn = prevState.turn + (selectedOption?.turnEffect || 0) + 1;
      
      // Reduce health by 5% each turn
      const healthReduction = -5;
      const newHealth = Math.max(0, prevState.clientHealth + healthReduction);
      
      // Check if level is complete (progress >= 100)
      let newLevel = prevState.level;
      let newInsuranceStatus = prevState.insuranceStatus;
      
      if (prevState.levelProgress[prevState.level] >= 100 && prevState.level < 2) {
        newLevel = prevState.level + 1;
        
        // Update insurance status based on level
        if (newLevel === 1) {
          newInsuranceStatus = "Shopping for Plans";
        } else if (newLevel === 2) {
          newInsuranceStatus = "Insured";
        }
        
        // Level complete toast notification
        toast({
          title: `Level ${prevState.level + 1} Complete!`,
          description: `You've advanced to the ${getLevelName(newLevel)} level.`,
        });
      }
      
      return {
        ...prevState,
        turn: newTurn,
        level: newLevel,
        insuranceStatus: newInsuranceStatus,
        clientHealth: newHealth
      };
    });
    
    setShowOutcome(false);
    setSelectedOption(null);
    
    // Chance to show a random setback
    const randomChance = Math.random() * 100;
    if (randomChance < 35) { // 35% chance of a setback between turns
      setShowSetback(true);
    } else {
      generateEvent();
    }
  }, [selectedOption, generateEvent, toast]);

  // Handle closing the setback modal
  const handleSetbackClose = useCallback(() => {
    setShowSetback(false);
    generateEvent();
  }, [generateEvent]);

  // Save game
  const saveGame = useCallback(async (username: string) => {
    try {
      setLoading(true);
      await apiRequest('POST', '/api/games/save', {
        username,
        gameState: JSON.stringify(gameState)
      });
      toast({
        title: "Game Saved",
        description: "Your progress has been saved successfully."
      });
    } catch (error) {
      console.error("Error saving game:", error);
      toast({
        title: "Save Failed",
        description: "Unable to save your game progress.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [gameState, toast]);

  // Load game
  const loadGame = useCallback(async (username: string) => {
    try {
      setLoading(true);
      const response = await apiRequest('GET', `/api/games/${username}`, undefined);
      const data = await response.json();
      
      if (data && data.gameState) {
        const loadedState: GameState = JSON.parse(data.gameState);
        setGameState(loadedState);
        setClient(getClient(loadedState.clientId));
        setPreviousProgress([...loadedState.levelProgress]);
        
        // Set current event if it exists in the loaded state
        if (loadedState.events.length > 0) {
          const eventId = loadedState.events[loadedState.events.length - 1];
          const event = getEvent(eventId);
          if (event) {
            setCurrentEvent(event);
          } else {
            generateEvent(loadedState);
          }
        } else {
          generateEvent(loadedState);
        }
        
        toast({
          title: "Game Loaded",
          description: "Your saved game has been loaded successfully."
        });
      }
    } catch (error) {
      console.error("Error loading game:", error);
      toast({
        title: "Load Failed",
        description: "Unable to load your saved game.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [generateEvent, toast]);

  // Check if game is over
  const isGameOver = gameState.clientHealth <= 0;
  
  // Check if game is won (completed all levels)
  const isGameWon = gameState.levelProgress[2] >= 100;

  // Toggle help modal
  const toggleHelp = useCallback(() => {
    setShowHelp(prev => !prev);
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    // Generate a new client ID to ensure we get a fresh client
    const newClientId = Math.floor(Math.random() * 1000) + 1;
    initGame(newClientId);
    // Force a full component reload
    window.location.reload();
    toast({
      title: "Game Restarted",
      description: "Starting a fresh game with a new client."
    });
  }, [initGame, toast]);

  // Get client status based on health
  const getClientStatus = useCallback(() => {
    const health = gameState.clientHealth;
    if (health > 80) return "Confident";
    if (health > 60) return "Satisfied";
    if (health > 40) return "Concerned";
    if (health > 20) return "Anxious";
    return "Distressed";
  }, [gameState.clientHealth]);

  return {
    gameState,
    currentEvent,
    client,
    showOutcome,
    selectedOption,
    loading,
    showHelp,
    showSetback,
    previousProgress,
    isGameOver,
    isGameWon,
    initGame,
    selectOption,
    continueTurn,
    applySetback,
    handleSetbackClose,
    saveGame,
    loadGame,
    toggleHelp,
    restartGame,
    getClientStatus
  };
};
