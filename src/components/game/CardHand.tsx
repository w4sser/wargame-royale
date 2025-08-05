import React from 'react';
import { GameCard } from './GameCard';

interface Card {
  id: string;
  name: string;
  cost: number;
  emoji: string;
  description: string;
}

interface CardHandProps {
  cards: Card[];
  elixir: number;
  onCardDragStart: (card: Card, event: React.DragEvent) => void;
}

export const CardHand: React.FC<CardHandProps> = ({
  cards,
  elixir,
  onCardDragStart
}) => {
  return (
    <div className="flex gap-3 p-4 bg-card/80 backdrop-blur-lg rounded-xl border border-border">
      {cards.map((card, index) => (
        <GameCard
          key={`${card.id}-${index}`}
          card={card}
          canAfford={elixir >= card.cost}
          onDragStart={onCardDragStart}
        />
      ))}
    </div>
  );
};