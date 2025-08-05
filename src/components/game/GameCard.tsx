import React from 'react';

interface Card {
  id: string;
  name: string;
  cost: number;
  emoji: string;
  description: string;
}

interface GameCardProps {
  card: Card;
  canAfford: boolean;
  onDragStart: (card: Card, event: React.DragEvent) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  card,
  canAfford,
  onDragStart
}) => {
  const handleDragStart = (event: React.DragEvent) => {
    if (canAfford) {
      onDragStart(card, event);
    } else {
      event.preventDefault();
    }
  };

  return (
    <div
      className={`game-card min-w-[80px] animate-bounce-card ${
        canAfford 
          ? 'opacity-100 hover:scale-105' 
          : 'opacity-50 cursor-not-allowed'
      }`}
      draggable={canAfford}
      onDragStart={handleDragStart}
    >
      <div className="text-center">
        <div className="text-3xl mb-2">{card.emoji}</div>
        <div className="text-sm font-bold text-card-foreground mb-1">
          {card.name}
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="text-xs text-accent font-bold">{card.cost}</span>
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-elixir to-elixir-glow opacity-80" />
        </div>
        <div className="text-xs text-muted-foreground mt-1 leading-tight">
          {card.description}
        </div>
      </div>
    </div>
  );
};