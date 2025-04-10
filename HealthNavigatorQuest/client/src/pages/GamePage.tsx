import { GameContainer } from "@/components/game/GameContainer";
import { Helmet } from "react-helmet";

export default function GamePage() {
  return (
    <>
      <Helmet>
        <title>Health Insurance Navigator Game</title>
        <meta name="description" content="A turn-based strategy game where you guide clients through the health insurance process" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <GameContainer />
      </div>
    </>
  );
}
