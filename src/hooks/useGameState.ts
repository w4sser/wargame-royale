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
      // Player towers
      { id: 'player-left', row: 16, col: 1, hp: 1000, maxHp: 1000, player: 'player' },
      { id: 'player-right', row: 16, col: 6, hp: 1000, maxHp: 1000, player: 'player' },
      { id: 'player-king', row: 17, col: 3, hp: 1500, maxHp: 1500, player: 'player' },
      // Enemy towers
      { id: 'enemy-left', row: 1, col: 1, hp: 1000, maxHp: 1000, player: 'enemy' },
      { id: 'enemy-right', row: 1, col: 6, hp: 1000, maxHp: 1000, player: 'enemy' },
      { id: 'enemy-king', row: 0, col: 3, hp: 1500, maxHp: 1500, player: 'enemy' },
    ]);

    // Elixir regeneration
    const elixirInterval = setInterval(() => {
      setElixir(prev => Math.min(prev + 1, 10));
    }, 1000);

    return () => clearInterval(elixirInterval);
  }, []);

  const deployUnit = useCallback((card: any, row: number, col: number) => {
    if (elixir < card.cost) return;

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
      targetRow: 0 // Move towards enemy territory
    };

    setUnits(prev => [...prev, newUnit]);
    setElixir(prev => prev - card.cost);
  }, [elixir]);

  const updateUnits = useCallback(() => {
    setUnits(prev => prev.map(unit => {
      if (unit.player === 'player') {
        // Move towards enemy territory
        const newRow = Math.max(0, unit.row - (unit.speed * 0.1));
        return { ...unit, row: newRow };
      }
      return unit;
    }).filter(unit => unit.hp > 0));

    // Simulate combat
    setTowers(prev => prev.map(tower => {
      const nearbyEnemyUnits = units.filter(unit => 
        unit.player !== tower.player &&
        Math.abs(unit.row - tower.row) <= 1 &&
        Math.abs(unit.col - tower.col) <= 1
      );

      if (nearbyEnemyUnits.length > 0) {
        return { ...tower, hp: Math.max(0, tower.hp - 50) };
      }
      return tower;
    }));
  }, [units]);

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