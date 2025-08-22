import React from 'react';
import { Unit, Tower } from '../../types/cards'; // <-- change to '../../types/game' if that's your file
import { GameUnit } from './GameUnit';
import { GameTower } from './GameTower';

interface GameGridProps {
  units: Unit[];
  towers: Tower[];
  onCellDrop: (row: number, col: number) => void;
  draggedCard: unknown; // tighten later if you want
}

export const GameGrid: React.FC<GameGridProps> = ({
  units,
  towers,
  onCellDrop,
  draggedCard
}) => {
  const numRows = 22;
  const numCols = 9;
  const midRow  = Math.floor(numRows / 2); // 11

  const renderCell = (row: number, col: number) => {
    const isEnemyTerritory  = row < midRow;
    const isPlayerTerritory = row >= midRow;
    const cellKey = `${row}-${col}`;

    const tower = towers.find(t => t.row === row && t.col === col);

    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); onCellDrop(row, col); };
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    return (
      <div
        key={cellKey}
        className={`grid-cell relative ${isEnemyTerritory ? 'enemy-territory' : 'player-territory'} ${
          draggedCard && isPlayerTerritory ? 'hover:bg-primary/20' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {tower && <GameTower tower={tower} />}

        {(col === 1 || col === 3 || col === 4 || col === 6) && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-full h-full border-l-2 border-dashed border-primary/30" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="game-grid max-w-3xl max-h-[90vh] relative"
      style={{
        aspectRatio: `${numCols} / ${numRows}`,
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 1fr)`,
        gridTemplateRows: `repeat(${numRows}, 1fr)`,
      }}
    >
      {Array.from({ length: numRows }, (_, row) =>
        Array.from({ length: numCols }, (_, col) => renderCell(row, col))
      )}

      <div
        className="absolute left-0 right-0 h-1 bg-blue-500/60 pointer-events-none"
        style={{ top: `${(midRow / numRows) * 100}%` }}
      />

      {units.map(u => <GameUnit key={u.id} unit={u} />)}
    </div>
  );
};