 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/game/GameGrid.tsx b/src/components/game/GameGrid.tsx
index 4c05569cf296b6e22903fc234e24e8bbb13c23dc..13b4be1ba3e7247714f765638a64cf56cae9be7b 100644
--- a/src/components/game/GameGrid.tsx
+++ b/src/components/game/GameGrid.tsx
@@ -1,35 +1,35 @@
 import React from 'react';
-import { Unit, Tower } from '../../types/game';
+import { Unit, Tower, Card } from '../../types/game';
 import { GameUnit } from './GameUnit';
 import { GameTower } from './GameTower';
 
 interface GameGridProps {
   units: Unit[];
   towers: Tower[];
   onCellDrop: (row: number, col: number) => void;
-  draggedCard: any;
+  draggedCard: Card | null;
 }
 
 export const GameGrid: React.FC<GameGridProps> = ({
   units,
   towers,
   onCellDrop,
   draggedCard
 }) => {
   const renderCell = (row: number, col: number) => {
     const isEnemyTerritory = row <= 10;
     const isPlayerTerritory = row >= 12;
     const cellKey = `${row}-${col}`;
     
     // Check if there's a tower at this position
     const tower = towers.find(t => t.row === row && t.col === col);
     
     const handleDrop = (event: React.DragEvent) => {
       event.preventDefault();
       onCellDrop(row, col);
     };
 
     const handleDragOver = (event: React.DragEvent) => {
       event.preventDefault();
     };
 
 
EOF
)