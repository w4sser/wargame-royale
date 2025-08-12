import { useState, useEffect, useCallback } from 'react';
import { Unit, Tower, GameState } from '../types/game';
import deckData from '../data/deck.json';

export const useGameState = () => {
  const [elixir, setElixir] = useState(5);
  const [hand, setHand] = useState<any[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    isGameOver: false,
    winner: null
  });

  // Initialize game
  useEffect(() => {
    // Create random hand
    const shuffledCards = [...deckData.cards].sort(() => Math.random() - 0.5);
    setHand(shuffledCards.slice(0, 4));

    // Initialize towers
    setTowers([
      // Player towers (evenly distributed at bottom)
      { id: 'player-left', row: 19, col: 2, hp: 1000, maxHp: 1000, player: 'player' },
      { id: 'player-right', row: 19, col: 6, hp: 1000, maxHp: 1000, player: 'player' },
      { id: 'player-king', row: 20, col: 4, hp: 1500, maxHp: 1500, player: 'player' },
      // Enemy towers (evenly distributed at top)
      { id: 'enemy-left', row: 2, col: 2, hp: 1000, maxHp: 1000, player: 'enemy' },
      { id: 'enemy-right', row: 2, col: 6, hp: 1000, maxHp: 1000, player: 'enemy' },
      { id: 'enemy-king', row: 1, col: 4, hp: 1500, maxHp: 1500, player: 'enemy' },
    ]);

    // Elixir regeneration
    const elixirInterval = setInterval(() => {
      setElixir(prev => Math.min(prev + 1, 10));
    }, 1000);

    return () => clearInterval(elixirInterval);
  }, []);

  const deployUnit = useCallback((card: any, row: number, col: number) => {
    if (elixir < card.cost) return;

    // Determine target lane - move to closest road (col 2 or col 6)
    const targetCol = Math.abs(col - 2) <= Math.abs(col - 6) ? 2 : 6;

    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      type: card.id,
      row,
      col,
      hp: card.hp,
      maxHp: card.hp,
      damage: card.damage,
      attackSpeed: card.attackSpeed,
      speed: card.speed || 1,
      player: 'player',
      lastAttack: 0,
      targetRow: 1, // Move towards enemy king tower
      targetCol,
      flying: card.flying || false
    };

    setUnits(prev => [...prev, newUnit]);
    setElixir(prev => prev - card.cost);
  }, [elixir]);

  const updateUnits = useCallback(() => {
    setUnits(prev => prev.map(unit => {
      if (unit.player === 'player') {
        let newRow = unit.row;
        let newCol = unit.col;
        
        // Move towards target lane first
        if (Math.abs(unit.col - unit.targetCol) > 0.1) {
          const colDirection = unit.targetCol > unit.col ? 1 : -1;
          newCol = unit.col + (colDirection * unit.speed * 0.1);
        } else {
          // In target lane, move forward
          // Check river crossing at row 11 for non-flying units
          if (!unit.flying && unit.row > 11 && (unit.row - unit.speed * 0.1) < 11) {
            // Can't cross river unless at bridges (col 2 or 6)
            if (Math.abs(unit.col - 2) > 0.5 && Math.abs(unit.col - 6) > 0.5) {
              // Stop at river if not at bridge
              newRow = 11;
            } else {
              newRow = Math.max(1, unit.row - (unit.speed * 0.1));
            }
          } else {
            newRow = Math.max(1, unit.row - (unit.speed * 0.1));
          }
        }
        
        return { ...unit, row: newRow, col: newCol };
      }
      return unit;
    }).filter(unit => unit.hp > 0));

    // Simulate combat with tower protection logic
    setTowers(prev => prev.map(tower => {
      const nearbyEnemyUnits = units.filter(unit => 
        unit.player !== tower.player &&
        Math.abs(unit.row - tower.row) <= 1 &&
        Math.abs(unit.col - tower.col) <= 1
      );

      if (nearbyEnemyUnits.length > 0) {
        // King tower protection - can only be attacked if side towers are destroyed
        if (tower.id === 'enemy-king') {
          const leftTower = towers.find(t => t.id === 'enemy-left');
          const rightTower = towers.find(t => t.id === 'enemy-right');
          
          if ((leftTower && leftTower.hp > 0) && (rightTower && rightTower.hp > 0)) {
            return tower; // King tower is protected
          }
        }
        
        return { ...tower, hp: Math.max(0, tower.hp - 50) };
      }
      return tower;
    }));
  }, [units, towers]);

  const checkVictory = useCallback(() => {
    const playerKingTower = towers.find(t => t.id === 'player-king');
    const enemyKingTower = towers.find(t => t.id === 'enemy-king');

    if (playerKingTower && playerKingTower.hp <= 0) {
      setGameState({ isGameOver: true, winner: 'enemy' });
    } else if (enemyKingTower && enemyKingTower.hp <= 0) {
      setGameState({ isGameOver: true, winner: 'player' });
    }
  }, [towers]);

  return {
    elixir,
    hand,
    units,
    towers,
    gameState,
    deployUnit,
    updateUnits,
    checkVictory
  };
};