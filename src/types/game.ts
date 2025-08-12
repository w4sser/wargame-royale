export interface Unit {
  id: string;
  type: string;
  row: number;
  col: number;
  hp: number;
  maxHp: number;
  damage: number;
  attackSpeed: number;
  speed: number;
  player: 'player' | 'enemy';
  lastAttack: number;
  targetRow: number;
  targetCol: number;
  flying: boolean;
}

export interface Tower {
  id: string;
  row: number;
  col: number;
  hp: number;
  maxHp: number;
  player: 'player' | 'enemy';
}

export interface GameState {
  isGameOver: boolean;
  winner: 'player' | 'enemy' | null;
}

export interface Card {
  id: string;
  name: string;
  cost: number;
  hp?: number;
  damage?: number;
  attackSpeed?: number;
  speed?: number;
  type: 'unit' | 'spell';
  description: string;
  icon?: string;
  emoji?: string;
  healing?: number;
  radius?: number;
  flying?: boolean;
}