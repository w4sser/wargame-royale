import React from 'react';
import { Unit, Tower, Card } from '../../types/game';
import { GameUnit } from './GameUnit';
import { GameTower } from './GameTower';

interface GameGridProps {
  units: Unit[];
  towers: Tower[];
  onCellDrop: (row: number, col: number) => void;
  draggedCard: Card | null;
}

export const GameGrid: React.FC<GameGridProps> = ({
  units,
  towers,
  onCellDrop,
  draggedCard
}) => {
  const renderCell = (row: number, col: number) => {
    const isEnemyTerritory = row <= 10;
    const isPlayerTerritory = row >= 12;
    const cellKey = `${row}-${col}`;
    
    // Check if there's a tower at this position
    const tower = towers.find(t => t.row === row && t.col === col);
    
    const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      onCellDrop(row, col);
    };

    const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
    };

    return (
      <div
        key={cellKey}
        className={`grid-cell ${isEnemyTerritory ? 'enemy-territory' : 'player-territory'} ${
          draggedCard && isPlayerTerritory ? 'hover:bg-primary/20' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Tower */}
        {tower && <GameTower tower={tower} />}
        
        {/* Lane indicators for middle columns */}
        {(col === 1 || col === 3 || col === 4 || col === 6) && (
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full border-l-2 border-dashed border-primary/30" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="game-grid max-w-3xl max-h-[90vh] aspect-[9/22] relative">
      {/* Grid cells */}
      {Array.from({ length: 22 }, (_, row) =>
        Array.from({ length: 9 }, (_, col) => renderCell(row, col))
      )}
      
      {/* River line */}
      <div className="absolute left-0 right-0 h-1 bg-blue-500/60" style={{ top: `${(11/22) * 100}%` }} />
      
      {/* Units */}
      {units.map(unit => (
        <GameUnit key={unit.id} unit={unit} />
      ))}
    </div>
  );
};