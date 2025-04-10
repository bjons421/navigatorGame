import { EventOption, GameEvent } from "@shared/schema";
import { useState } from "react";
import { createOptionFromEvaluation } from "@/lib/textEvaluator";

interface EventCardProps {
  event: GameEvent;
  onSelectOption: (option: EventOption) => void;
}

export function EventCard({ event, onSelectOption }: EventCardProps) {
  const [responseText, setResponseText] = useState("");
  
  const handleSubmitResponse = () => {
    if (!responseText.trim()) return;
    
    // Create a virtual option based on the text analysis
    const evaluatedOption = createOptionFromEvaluation(responseText, event);
    
    // Pass the evaluated option to the parent component
    onSelectOption(evaluatedOption);
    
    // Reset the text input
    setResponseText("");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm transition-all">
      <div className="flex items-center mb-3">
        <span className="text-warning mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
        </span>
        <h3 className="font-semibold text-gray-900">{event.title}</h3>
      </div>
      <p className="mb-4">{event.description}</p>
      <div className="flex items-center text-danger mb-4">
        <span className="mr-1 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </span>
        <span className="text-sm font-medium">{event.healthImpact}% Client Health if not addressed</span>
      </div>
      <div className="bg-light p-3 rounded-lg mb-4">
        <h4 className="font-medium mb-3">{event.prompt || "How would you help the client in this situation?"}</h4>
        <div className="space-y-3">
          <textarea 
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your response to help the client..."
            rows={5}
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
          <div className="text-sm text-gray-500 mb-3">
            <p>Provide a detailed explanation to help the client. The more specific and accurate your response, the better outcome you'll achieve.</p>
          </div>
          <button 
            onClick={handleSubmitResponse}
            disabled={!responseText.trim()}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              responseText.trim() 
                ? "bg-primary hover:bg-blue-700 text-white" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit Response
          </button>
        </div>
      </div>
    </div>
  );
}
