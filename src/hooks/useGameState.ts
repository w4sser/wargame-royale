import { useState, useEffect, useCallback } from 'react';
import { Unit, Tower, GameState, Card } from '../types/cards'; // <-- or '../types/game'
import deckData from '../data/deck.json';

export const useGameState = () => {
  const [elixir, setElixir] = useState(5);
  const [hand, setHand] = useState<Card[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [gameState, setGameState] = useState<GameState>({ isGameOver: false, winner: null });

  // ---------- INIT ----------
  useEffect(() => {
    // initial hand
    const shuffled = [...(deckData.cards as Card[])].sort(() => Math.random() - 0.5);
    setHand(shuffled.slice(0, 4));

    // towers (22x9 Clash layout)
    const NUM_ROWS = 22;
    const NUM_COLS = 9;
    const MID_COL   = Math.floor(NUM_COLS / 2); // 4
    const LEFT_COL  = 2;
    const RIGHT_COL = NUM_COLS - 3;             // 6
    const ENEMY_CROWN_ROW  = 2;
    const ENEMY_KING_ROW   = 0;
    const PLAYER_CROWN_ROW = NUM_ROWS - 3;      // 19
    const PLAYER_KING_ROW  = NUM_ROWS - 1;      // 21

    setTowers([
      // Player (bottom)
      { id: 'player-left',  row: PLAYER_CROWN_ROW, col: LEFT_COL,  hp: 1000, maxHp: 1000, player: 'player' },
      { id: 'player-right', row: PLAYER_CROWN_ROW, col: RIGHT_COL, hp: 1000, maxHp: 1000, player: 'player' },
      { id: 'player-king',  row: PLAYER_KING_ROW,  col: MID_COL,   hp: 1500, maxHp: 1500, player: 'player' },

      // Enemy (top)
      { id: 'enemy-left',  row: ENEMY_CROWN_ROW, col: LEFT_COL,  hp: 1000, maxHp: 1000, player: 'enemy' },
      { id: 'enemy-right', row: ENEMY_CROWN_ROW, col: RIGHT_COL, hp: 1000, maxHp: 1000, player: 'enemy' },
      { id: 'enemy-king',  row: ENEMY_KING_ROW,  col: MID_COL,   hp: 1500, maxHp: 1500, player: 'enemy' },
    ]);

    const t = setInterval(() => setElixir(p => Math.min(p + 1, 10)), 1000);
    return () => clearInterval(t);
  }, []);
  // -------- END INIT --------

  // ---------- FUNCTIONS ----------
  const deployUnit = useCallback((card: Card, row: number, col: number) => {
    if (elixir < card.cost) return;

    const targetCol = Math.abs(col - 2) <= Math.abs(col - 6) ? 2 : 6;

    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      type: card.id,
      row,
      col,
      hp: card.hp ?? 100,
      maxHp: card.hp ?? 100,
      damage: card.damage ?? 20,
      attackSpeed: card.attackSpeed ?? 1.0,
      speed: card.speed ?? 1,
      player: 'player',
      lastAttack: 0,
      targetRow: 1,
      targetCol,
      flying: !!card.flying,
    };

    setUnits(prev => [...prev, newUnit]);
    setElixir(prev => prev - card.cost);
  }, [elixir]);

  const updateUnits = useCallback(() => {
    const MID_ROW = Math.floor(22 / 2); // 11
    setUnits(prev => prev.map(unit => {
      if (unit.player !== 'player') return unit;

      let newRow = unit.row;
      let newCol = unit.col;

      if (Math.abs(unit.col - unit.targetCol) > 0.1) {
        const colDir = unit.targetCol > unit.col ? 1 : -1;
        newCol = unit.col + (colDir * unit.speed * 0.1);
      } else {
        if (!unit.flying && unit.row > MID_ROW && (unit.row - unit.speed * 0.1) < MID_ROW) {
          if (Math.abs(unit.col - 2) > 0.5 && Math.abs(unit.col - 6) > 0.5) {
            newRow = MID_ROW;
          } else {
            newRow = Math.max(1, unit.row - (unit.speed * 0.1));
          }
        } else {
          newRow = Math.max(1, unit.row - (unit.speed * 0.1));
        }
      }
      return { ...unit, row: newRow, col: newCol };
    }).filter(u => u.hp > 0));

    // simple tower damage when adjacent
    setTowers(prev => prev.map(tower => {
      const nearby = units.filter(u =>
        u.player !== tower.player &&
        Math.abs(u.row - tower.row) <= 1 &&
        Math.abs(u.col - tower.col) <= 1
      );

      if (nearby.length > 0) {
        if (tower.id === 'enemy-king') {
          const left = towers.find(t => t.id === 'enemy-left');
          const right = towers.find(t => t.id === 'enemy-right');
          if ((left && left.hp > 0) && (right && right.hp > 0)) return tower; // protected
        }
        return { ...tower, hp: Math.max(0, tower.hp - 50) };
      }
      return tower;
    }));
  }, [units, towers]);

  const checkVictory = useCallback(() => {
    const playerKing = towers.find(t => t.id === 'player-king');
    const enemyKing  = towers.find(t => t.id === 'enemy-king');
    if (playerKing && playerKing.hp <= 0) setGameState({ isGameOver: true, winner: 'enemy' });
    else if (enemyKing && enemyKing.hp <= 0) setGameState({ isGameOver: true, winner: 'player' });
  }, [towers]);
  // -------- END FUNCTIONS --------

  return { elixir, hand, units, towers, gameState, deployUnit, updateUnits, checkVictory };
};