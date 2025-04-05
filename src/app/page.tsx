'use client';

import { GameBoard } from './_components/GameBoard';
import { GameModeSelector } from '@/components/GameModeSelector';

import { useGameStore } from '@/stores';
import { GridSolver } from '@/lib/gridUtils';
import {
    validSets,
    GRID_COL,
    GRID_ROW,
    MAX_NUMBER,
} from '@/config/gridConstants';

import { GameMode } from '@/types';

export default function Home() {
    const { gameMode, setGrid, setGameMode } = useGameStore();

    const handleGameStart = (gameMode: GameMode): void => {
        setGameMode(gameMode);
        const gridGenarated = new GridSolver(
            GRID_ROW,
            GRID_COL,
            validSets,
            MAX_NUMBER,
        ).generateSolvableGrid();
        setGrid(gridGenarated);
    };

    return (
        <main className="mx-auto">
            {gameMode ? (
                <GameBoard />
            ) : (
                <GameModeSelector onStart={handleGameStart} />
            )}
        </main>
    );
}
