import { useState, useEffect } from "react";
import { StatusBar } from "./StatusBar";
import { ClientProfile } from "./ClientProfile";
import { EventCard } from "./EventCard";
import { OutcomeCard } from "./OutcomeCard";
import { GameControls } from "./GameControls";
import { HelpModal } from "./HelpModal";
import { LevelInfoCards } from "./LevelInfoCards";
import { RandomSetback } from "./RandomSetback";
import { useGameState } from "@/hooks/useGameState";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function GameContainer() {
  const [gameStarted, setGameStarted] = useState(false);
  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const [gameOverDialogOpen, setGameOverDialogOpen] = useState(false);
  const [gameWonDialogOpen, setGameWonDialogOpen] = useState(false);
  
  const {
    gameState,
    currentEvent,
    client,
    showOutcome,
    selectedOption,
    showHelp,
    showSetback,
    isGameOver,
    isGameWon,
    selectOption,
    continueTurn,
    applySetback,
    handleSetbackClose,
    toggleHelp,
    restartGame,
    getClientStatus,
    initGame
  } = useGameState();

  // Check for game over or win conditions
  useEffect(() => {
    if (isGameOver && !gameOverDialogOpen) {
      setGameOverDialogOpen(true);
    }

    if (isGameWon && !gameWonDialogOpen) {
      setGameWonDialogOpen(true);
    }
  }, [isGameOver, isGameWon, gameOverDialogOpen, gameWonDialogOpen]);

  const clientStatus = getClientStatus();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Health Insurance Navigator</h1>
        <p className="text-gray-600 mt-2">Guide your client through the health insurance journey</p>
      </header>

      {/* Game Board */}
      {gameStarted && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* Game Status Bar */}
        <StatusBar gameState={gameState} clientName={client.name} />
        
        {/* Client Profile */}
        <ClientProfile client={client} gameState={gameState} clientStatus={clientStatus} />
        
        {/* Game Content Area */}
        <div className="mb-6">
          <AnimatePresence mode="wait">
            {currentEvent && !showOutcome && (
              <motion.div
                key="event-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EventCard 
                  event={currentEvent} 
                  onSelectOption={selectOption} 
                />
              </motion.div>
            )}
            
            {showOutcome && currentEvent && selectedOption && (
              <motion.div
                key="outcome-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OutcomeCard 
                  event={currentEvent} 
                  selectedOption={selectedOption} 
                  onContinue={continueTurn} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game Controls */}
        <GameControls 
          onHelpClick={toggleHelp} 
          onRestartClick={restartGame}
        />

        {/* Help Modal */}
        <HelpModal isOpen={showHelp} onClose={toggleHelp} />
      </div>
      )}

      
      {/* Level Information Cards */}
      <LevelInfoCards gameState={gameState} />
      
      {/* Random Setback Modal */}
      <RandomSetback 
        gameState={gameState}
        isVisible={showSetback}
        onClose={handleSetbackClose}
        onApplySetback={applySetback}
      />

      {/* Game Start/Instructions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 text-center">
        {!gameStarted ? (
          <div className="py-8">
            <h2 className="text-2xl font-bold mb-4">Welcome to Health Insurance Navigator</h2>
            <button
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              onClick={() => {
                initGame();
                setGameStarted(true);
              }}
            >
              Start Game
            </button>
          </div>
        ) : (
          <>
          <button 
            className="md:hidden w-full flex justify-between items-center" 
            onClick={() => setInstructionsVisible(!instructionsVisible)}
          >
          <span className="font-medium">Game Instructions</span>
          <span>
            {instructionsVisible ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
            )}
          </span>
        </button>
        <div className={`${instructionsVisible ? 'block' : 'hidden'} md:block mt-2 md:mt-0`}>
          <p className="text-sm mb-2">Welcome to Health Insurance Navigator! In this game, you'll help {client.name} navigate the complex world of health insurance.</p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>Respond to events that affect your client's health and insurance journey</li>
            <li>Make strategic choices to improve knowledge and maintain client health</li>
            <li>Progress through three levels: Awareness, Enrollment, and Utilization</li>
            <li>Win by successfully guiding your client to full insurance coverage and utilization</li>
          </ul>
        </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mt-8">
        <p>Health Insurance Navigator Game &copy; {new Date().getFullYear()}</p>
      </footer>

      {/* Game Over Dialog */}
      <Dialog open={gameOverDialogOpen} onOpenChange={setGameOverDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-danger text-center text-2xl">Game Over</DialogTitle>
            <DialogDescription className="text-center pt-4">
              Your client's health has reached 0%. You were unable to successfully guide them through the health insurance process.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center mb-2">Final score: {gameState.score}</p>
            <p className="text-center">Level reached: {gameState.level + 1} ({gameState.levelProgress[gameState.level]}% completed)</p>
          </div>
          <DialogFooter>
            <Button 
              className="w-full" 
              onClick={() => {
                restartGame();
                setGameOverDialogOpen(false);
              }}
            >
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Game Won Dialog */}
      <Dialog open={gameWonDialogOpen} onOpenChange={setGameWonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-secondary text-center text-2xl">Victory!</DialogTitle>
            <DialogDescription className="text-center pt-4">
              Congratulations! You've successfully guided your client through all stages of the health insurance process!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center mb-2">Final score: {gameState.score}</p>
            <p className="text-center">Client health: {gameState.clientHealth}%</p>
            <p className="text-center">Completed in {gameState.turn} turns</p>
          </div>
          <DialogFooter>
            <Button 
              className="w-full" 
              onClick={() => {
                restartGame();
                setGameWonDialogOpen(false);
              }}
            >
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
