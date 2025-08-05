import React from 'react';
import { Tower } from '../../types/game';

interface GameTowerProps {
  tower: Tower;
}

export const GameTower: React.FC<GameTowerProps> = ({ tower }) => {
  const healthPercentage = (tower.hp / tower.maxHp) * 100;
  const isPlayerTower = tower.player === 'player';

  return (
    <div className={`tower w-full h-full ${isPlayerTower ? 'bg-player-tower' : 'bg-enemy-tower'}`}>
      <div className="text-xs">🏰</div>
      
      {/* Health bar */}
      <div className="absolute bottom-1 left-1 right-1 h-1 bg-destructive/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-health transition-all duration-300"
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
      
      {/* HP display */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs font-bold">
        {tower.hp}
      </div>
    </div>
  );
};