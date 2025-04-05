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

export default function Fujiten() {
    const {
        score,
        gameMode,
        setGrid,
        setGameMode,
        resetScore,
        resetPositions,
    } = useGameStore();

    const handleGameStart = (gameMode: GameMode): void => {
        setGameMode(gameMode);
        const gridGenarated = new GridSolver(
            GRID_ROW,
            GRID_COL,
            validSets,
            MAX_NUMBER,
        ).generateSolvableGrid();
        setGrid(gridGenarated);

        resetScore();
        resetPositions();
    };

    return (
        <main>
            {gameMode ? (
                <div className="min-h-screen flex flex-row justify-evenly">
                    <section id="scoring" className="place-items-center">
                        <div className="justify-self-start h-fit w-full text-center">
                            <div className="mx-4 mt-4">
                                <h3 className="font-bold text-3xl text-accent">
                                    SCORE
                                </h3>
                                <p className="text-2xl">{score}</p>
                            </div>
                        </div>
                        <GameBoard />
                    </section>

                    <div className="h-full border mt-4">
                        <div>
                            <h3 className="font-bold text-2xl text-accent">
                                TIMER
                            </h3>
                            <p className="text-xl">60</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-2xl text-destructive">
                                RESET GAME
                            </h3>
                        </div>

                        <div>
                            <h3 className="font-bold text-2xl text-sidebar-foreground">
                                GAME MODES
                            </h3>
                        </div>
                    </div>
                </div>
            ) : (
                <GameModeSelector onStart={handleGameStart} />
            )}
        </main>
    );
}
