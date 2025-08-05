import React from 'react';

interface ElixirBarProps {
  current: number;
  max: number;
}

export const ElixirBar: React.FC<ElixirBarProps> = ({ current, max }) => {
  const percentage = (current / max) * 100;

  return (
    <div className="flex items-center gap-3 bg-card/80 backdrop-blur-lg rounded-full px-4 py-2 border border-border">
      <div className="text-sm font-bold text-accent">⚡</div>
      <div className="relative w-32 h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="elixir-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-sm font-bold text-foreground min-w-[40px]">
        {current}/{max}
      </div>
    </div>
  );
};