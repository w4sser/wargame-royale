import React from 'react';
import { Button } from '../ui/button';

interface VictoryBannerProps {
  winner: 'player' | 'enemy';
}

export const VictoryBanner: React.FC<VictoryBannerProps> = ({ winner }) => {
  const isPlayerWin = winner === 'player';

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="victory-banner p-8 text-center animate-victory max-w-md">
      <div className="text-6xl mb-4">
        {isPlayerWin ? '🎉' : '💀'}
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-2">
        {isPlayerWin ? 'VICTORY!' : 'DEFEAT!'}
      </h2>
      <p className="text-lg text-muted-foreground mb-6">
        {isPlayerWin 
          ? 'You have conquered the battlefield!' 
          : 'Your towers have fallen...'}
      </p>
      <Button 
        onClick={handleRestart}
        variant="default"
        size="lg"
        className="bg-primary hover:bg-primary-glow"
      >
        Play Again
      </Button>
    </div>
  );
};