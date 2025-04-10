import { GameState, Client } from "@shared/schema";

interface ClientProfileProps {
  client: Client;
  gameState: GameState;
  clientStatus: string;
}

export function ClientProfile({ client, gameState, clientStatus }: ClientProfileProps) {
  // Status indicator color based on client health
  const getStatusColor = () => {
    const health = gameState.clientHealth;
    if (health > 80) return "bg-secondary";
    if (health > 60) return "bg-blue-500";
    if (health > 40) return "bg-warning";
    if (health > 20) return "bg-orange-500";
    return "bg-danger";
  };

  // Status icon based on client health
  const getStatusIcon = () => {
    const health = gameState.clientHealth;
    if (health > 80) return "sentiment_very_satisfied";
    if (health > 60) return "sentiment_satisfied";
    if (health > 40) return "sentiment_neutral";
    if (health > 20) return "sentiment_dissatisfied";
    return "sentiment_very_dissatisfied";
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      {/* Client Avatar */}
      <div className="w-full md:w-1/3 flex flex-col items-center">
        <div className="relative w-40 h-40 mb-3">
          <div className="absolute inset-0 rounded-full bg-light flex items-center justify-center overflow-hidden">
            <img
              src={client.avatar}
              alt={`${client.name} avatar`}
              className="object-cover w-full h-full"
            />
            <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full ${getStatusColor()} border-4 border-white flex items-center justify-center`}>
              <span className="text-white text-sm">
                {getStatusIcon() === "sentiment_very_satisfied" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smile"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                )}
                {getStatusIcon() === "sentiment_satisfied" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smile"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                )}
                {getStatusIcon() === "sentiment_neutral" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-meh"><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="15" y2="15"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                )}
                {getStatusIcon() === "sentiment_dissatisfied" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-frown"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                )}
                {getStatusIcon() === "sentiment_very_dissatisfied" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-frown"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="text-center bg-light px-4 py-2 rounded-full font-medium text-dark">
          {clientStatus}
        </div>
      </div>

      {/* Client Status */}
      <div className="w-full md:w-2/3 bg-light rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Client Status</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-1/3 font-medium">Insurance:</div>
            <div className={`w-2/3 font-medium ${gameState.insuranceStatus === "Insured" ? "text-secondary" : (gameState.insuranceStatus === "Shopping for Plans" ? "text-blue-500" : "text-warning")}`}>
              {gameState.insuranceStatus}
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/3 font-medium">Level:</div>
            <div className="w-2/3 font-medium">
              {gameState.level === 0 ? "Awareness" : 
               gameState.level === 1 ? "Enrollment" : "Utilization"} 
              ({gameState.levelProgress[gameState.level]}% Complete)
            </div>
          </div>
          <div className="bg-white rounded p-3 text-sm border border-gray-200">
            <p className="italic">{client.concerns[0]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}