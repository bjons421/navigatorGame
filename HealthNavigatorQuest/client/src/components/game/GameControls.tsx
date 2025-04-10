interface GameControlsProps {
  onHelpClick: () => void;
  onRestartClick: () => void;
}

export function GameControls({ onHelpClick, onRestartClick }: GameControlsProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-200 pt-4">
      <div className="w-full md:w-auto order-2 md:order-1">
        <button 
          onClick={onHelpClick}
          className="flex items-center justify-center w-full md:w-auto bg-light hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-md transition-colors"
        >
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </span>
          Game Help
        </button>
      </div>
      
      <div className="w-full md:w-auto order-1 md:order-2">
        <button 
          onClick={onRestartClick}
          className="flex items-center justify-center w-full md:w-auto bg-light hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-md transition-colors"
        >
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
          </span>
          Restart
        </button>
      </div>
    </div>
  );
}
