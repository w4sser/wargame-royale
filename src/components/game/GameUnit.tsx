import React from 'react';
import { Unit } from '../../types/game';

interface GameUnitProps {
  unit: Unit;
}

export const GameUnit: React.FC<GameUnitProps> = ({ unit }) => {
  const cellSize = 100 / 18; // Each cell is roughly 1/18 of the grid height
  
  const style = {
    left: `${(unit.col / 8) * 100}%`,
    top: `${(unit.row / 18) * 100}%`,
    transform: `translate(25%, 25%)`, // Center in cell
  };

  return (
    <div 
      className="game-unit goblin-unit animate-unit-move" 
      style={style}
    >
      <span className="text-xs">👹</span>
      
      {/* Health bar */}
      <div className="absolute -top-2 left-0 w-full h-1 bg-destructive/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-health transition-all duration-300"
          style={{ width: `${(unit.hp / unit.maxHp) * 100}%` }}
        />
      </div>
    </div>
  );
};