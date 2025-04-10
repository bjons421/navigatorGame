interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-gray-900">Game Help</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-lg mb-2">How to Play</h4>
            <p className="mb-2">Health Insurance Navigator is a turn-based strategy game where you help a client navigate the complex world of health insurance.</p>
            <p>The game consists of three levels:</p>
            <ul className="list-disc pl-5 mt-2 mb-4 space-y-1">
              <li><span className="font-medium">Awareness</span> - Help your client understand health insurance basics</li>
              <li><span className="font-medium">Enrollment</span> - Guide your client through selecting and enrolling in a plan</li>
              <li><span className="font-medium">Utilization</span> - Help your client effectively use their insurance</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-lg mb-2">Game Mechanics</h4>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <span className="font-medium">Client Health</span>
                <p className="text-sm mt-1">Represents your client's physical and mental well-being. If it reaches 0%, you lose the game.</p>
              </li>
              <li>
                <span className="font-medium">Knowledge Level</span>
                <p className="text-sm mt-1">Shows how well your client understands health insurance. Higher knowledge helps with decision making.</p>
              </li>
              <li>
                <span className="font-medium">Events</span>
                <p className="text-sm mt-1">Random situations that affect your client. You must choose how to respond.</p>
              </li>
              <li>
                <span className="font-medium">Choices</span>
                <p className="text-sm mt-1">Each choice has different effects on health, knowledge, confidence, and may take different amounts of time.</p>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-2">Winning the Game</h4>
            <p>Successfully guide your client through all three levels while maintaining their health to win!</p>
          </div>
        </div>
        <div className="bg-light p-4 rounded-b-xl">
          <button 
            onClick={onClose}
            className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
