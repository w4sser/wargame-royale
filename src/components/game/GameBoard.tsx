import React, { useState, useEffect, useRef } from 'react';
import { CardHand } from './CardHand';
import { ElixirBar } from './ElixirBar';
import { GameGrid } from './GameGrid';
import { VictoryBanner } from './VictoryBanner';
import { useGameState } from '../../hooks/useGameState';
import { toast } from 'sonner';

export const GameBoard: React.FC = () => {
  const {
    elixir,
    hand,
    units,
    towers,
    gameState,
    deployUnit,
    updateUnits,
    checkVictory
  } = useGameState();

  const [draggedCard, setDraggedCard] = useState<any>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      updateUnits();
      checkVictory();
    }, 100);

    return () => clearInterval(interval);
  }, [updateUnits, checkVictory]);

  const handleCardDragStart = (card: any, event: React.DragEvent) => {
    setDraggedCard(card);
    toast(`Deploying ${card.name}!`);
  };

  const handleGridDrop = (row: number, col: number) => {
    if (draggedCard && elixir >= draggedCard.cost) {
      // Only allow deployment in player territory (rows 9-17)
      if (row >= 9) {
        deployUnit(draggedCard, row, col);
        setDraggedCard(null);
        toast.success(`${draggedCard.name} deployed!`);
      } else {
        toast.error("Can't deploy in enemy territory!");
      }
    } else if (draggedCard) {
      toast.error("Not enough elixir!");
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (draggedCard) {
      setDragPosition({ x: event.clientX, y: event.clientY });
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-background overflow-hidden"
      onMouseMove={handleMouseMove}
      ref={boardRef}
    >
      {/* Game Grid */}
      <div className="absolute inset-4 flex items-center justify-center">
        <GameGrid
          units={units}
          towers={towers}
          onCellDrop={handleGridDrop}
          draggedCard={draggedCard}
        />
      </div>

      {/* Elixir Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <ElixirBar current={elixir} max={10} />
      </div>

      {/* Card Hand */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <CardHand
          cards={hand}
          elixir={elixir}
          onCardDragStart={handleCardDragStart}
        />
      </div>

      {/* Dragged Card Preview */}
      {draggedCard && (
        <div
          className="fixed pointer-events-none z-50 game-card animate-pulse-soft"
          style={{
            left: dragPosition.x - 40,
            top: dragPosition.y - 60,
            transform: 'scale(0.8)',
          }}
        >
          <div className="text-2xl">{draggedCard.emoji}</div>
          <div className="text-xs font-bold">{draggedCard.name}</div>
        </div>
      )}

      {/* Victory Banner */}
      {gameState.isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <VictoryBanner winner={gameState.winner} />
        </div>
      )}

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
    </div>
  );
};