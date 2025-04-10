import { GameEvent, EventOption } from "@shared/schema";

interface OutcomeCardProps {
  event: GameEvent;
  selectedOption: EventOption;
  onContinue: () => void;
}

export function OutcomeCard({ event, selectedOption, onContinue }: OutcomeCardProps) {
  // Determine the outcome card style based on the health effect
  const getOutcomeCardStyle = () => {
    if (selectedOption.healthEffect > 10) return "border-l-4 border-l-secondary";
    else if (selectedOption.healthEffect > 0) return "border-l-4 border-l-blue-500";
    else if (selectedOption.healthEffect === 0) return "border-l-4 border-l-gray-400";
    else if (selectedOption.healthEffect >= -10) return "border-l-4 border-l-orange-500";
    else return "border-l-4 border-l-danger";
  };
  
  // Determine the header text and icon based on the outcome quality
  const getOutcomeHeader = () => {
    if (selectedOption.healthEffect > 10) return { text: "Excellent Outcome", icon: "check-circle", className: "text-secondary" };
    else if (selectedOption.healthEffect > 0) return { text: "Good Outcome", icon: "check", className: "text-blue-500" };
    else if (selectedOption.healthEffect === 0) return { text: "Neutral Outcome", icon: "minus-circle", className: "text-gray-500" };
    else if (selectedOption.healthEffect >= -10) return { text: "Poor Outcome", icon: "alert-circle", className: "text-orange-500" };
    else return { text: "Harmful Outcome", icon: "x-circle", className: "text-danger" };
  };
  
  const outcomeHeader = getOutcomeHeader();

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm transition-all ${getOutcomeCardStyle()}`}>
      <div className="flex items-center mb-3">
        <span className={`${outcomeHeader.className} mr-2`}>
          {outcomeHeader.icon === "check-circle" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          )}
          {outcomeHeader.icon === "check" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>
          )}
          {outcomeHeader.icon === "minus-circle" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus-circle"><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
          )}
          {outcomeHeader.icon === "alert-circle" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          )}
          {outcomeHeader.icon === "x-circle" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
          )}
        </span>
        <h3 className="font-semibold text-gray-900">{outcomeHeader.text}</h3>
      </div>
      
      <div className="bg-light p-4 rounded-lg mb-4">
        <p className="italic text-gray-700">"{selectedOption.text}"</p>
      </div>
      
      <p className="mb-4">{selectedOption.outcome}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-light p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Health Impact</p>
          <p className={`font-medium flex justify-center items-center ${selectedOption.healthEffect > 0 ? 'text-secondary' : (selectedOption.healthEffect < 0 ? 'text-danger' : 'text-gray-500')}`}>
            <span className="mr-1">
              {selectedOption.healthEffect > 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trend-up"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>
              ) : selectedOption.healthEffect < 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trend-down"><polyline points="3 7 9 13 13 9 21 17"/><polyline points="14 17 21 17 21 10"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              )}
            </span>
            {selectedOption.healthEffect > 0 ? `+${selectedOption.healthEffect}%` : `${selectedOption.healthEffect}%`}
          </p>
        </div>
        <div className="bg-light p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Knowledge Impact</p>
          <p className={`font-medium flex justify-center items-center ${selectedOption.knowledgeEffect > 0 ? 'text-primary' : (selectedOption.knowledgeEffect < 0 ? 'text-danger' : 'text-gray-500')}`}>
            <span className="mr-1">
              {selectedOption.knowledgeEffect > 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trend-up"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>
              ) : selectedOption.knowledgeEffect < 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trend-down"><polyline points="3 7 9 13 13 9 21 17"/><polyline points="14 17 21 17 21 10"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              )}
            </span>
            {selectedOption.knowledgeEffect > 0 ? `+${selectedOption.knowledgeEffect}%` : `${selectedOption.knowledgeEffect}%`}
          </p>
        </div>
        <div className="bg-light p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Score Impact</p>
          <p className={`font-medium flex justify-center items-center ${selectedOption.scoreEffect > 0 ? 'text-gray-900' : (selectedOption.scoreEffect < 0 ? 'text-danger' : 'text-gray-500')}`}>
            <span className="mr-1">
              {selectedOption.scoreEffect > 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ) : selectedOption.scoreEffect < 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star-off"><line x1="3" x2="21" y1="3" y2="21"/><path d="M10.012 6.016l1.981-4.014 3.086 6.253 6.9 1-4.421 4.304.5 3.548"/><path d="M7.5 13.5 4.46 15.223l.672-5.157-4.286-4.401 5.898-.816 2.091-4.569 2.099 4.569 5.908.817-3.736 3.822"/><path d="M11 14l-3 7 5-3 5 3-2.5-6.5"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              )}
            </span>
            {selectedOption.scoreEffect > 0 ? `+${selectedOption.scoreEffect}` : selectedOption.scoreEffect}
          </p>
        </div>
      </div>
      
      {selectedOption.turnEffect > 0 && (
        <div className="bg-warning/10 p-3 rounded-lg text-warning text-sm flex items-center mb-4">
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </span>
          This action takes extra time and will advance the game by {selectedOption.turnEffect} additional {selectedOption.turnEffect === 1 ? 'turn' : 'turns'}.
        </div>
      )}
      
      <div className="border-t border-gray-200 pt-4">
        <button 
          onClick={onContinue}
          className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Continue to Next Turn
        </button>
      </div>
    </div>
  );
}
