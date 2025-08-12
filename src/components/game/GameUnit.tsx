import React from 'react';
import { Unit } from '../../types/game';
import { Users, Target, Shield, Sparkles, Bird, Mountain, Truck, Wrench } from 'lucide-react';
import deckData from '../../data/deck.json';

interface GameUnitProps {
  unit: Unit;
}

export const GameUnit: React.FC<GameUnitProps> = ({ unit }) => {
  const style = {
    left: `${(unit.col / 9) * 100}%`,
    top: `${(unit.row / 22) * 100}%`,
    transform: `translate(25%, 25%)`, // Center in cell
  };

  // Find card data to get icon
  const cardData = deckData.cards.find(card => card.id === unit.type);
  const iconName = cardData?.icon || 'Users';
  
  // Icon mapping
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Users, Target, Shield, Sparkles, Bird, Mountain, Truck, Wrench
  };
  
  const IconComponent = iconMap[iconName] || Users;

  return (
    <div 
      className={`game-unit ${unit.type}-unit animate-unit-move ${unit.flying ? 'flying-unit' : ''}`}
      style={style}
    >
      <IconComponent size={12} className="text-primary" />
      
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