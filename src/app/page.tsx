'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { GameLabel } from '@/components/GameLabel';
import { GameBoard } from './_components/GameBoard';
import { GameModeSelector } from '@/components/GameModeSelector';

import { useGameStore } from '@/stores';
import { useTimer } from 'react-timer-hook';
import { GridSolver } from '@/lib/gridUtils';
import { cn, generateDateInSeconds } from '@/lib/utils';
import {
    validSets,
    GRID_COL,
    GRID_ROW,
    MAX_NUMBER,
} from '@/config/gridConstants';
import { timeAttackTimer } from '@/config/gameConstants';

import { GameMode } from '@/types';

export default function Fujiten() {
    const {
        score,
        gameMode,
        setGrid,
        setGameMode,
        resetGame,
        resetScore,
        resetPositions,
    } = useGameStore();

    const {
        totalSeconds: timeLeft,
        start: startTimer,
        restart: restartTimer,
    } = useTimer({
        expiryTimestamp: generateDateInSeconds(timeAttackTimer),
        autoStart: false,
        onExpire: () => alert('onExpire called'),
    });

    const generateGrid = useCallback(() => {
        return new GridSolver(
            GRID_ROW,
            GRID_COL,
            validSets,
            MAX_NUMBER,
        ).generateSolvableGrid();
    }, []);

    const handleResetTimer = useCallback(
        (autoStart: boolean = false) => {
            const newTimer = generateDateInSeconds(timeAttackTimer);
            restartTimer(newTimer, autoStart);
        },
        [restartTimer],
    );

    const handleGameStart = (gameMode: GameMode): void => {
        const gridGenarated = generateGrid();
        setGrid(gridGenarated);

        if (gameMode === 'time-attack') {
            startTimer();
        }
        resetScore();
        resetPositions();
        setGameMode(gameMode);
    };

    const handleGameMode = (): void => {
        resetGame();
        handleResetTimer();
    };

    const handleGameReset = (): void => {
        resetScore();
        resetPositions();

        const isTimeAttack = gameMode === 'time-attack';
        handleResetTimer(isTimeAttack);

        const gridGenarated = generateGrid();
        setGrid(gridGenarated);
    };

    return (
        <main>
            {gameMode ? (
                <div className="flex flex-row justify-evenly">
                    <section
                        id="scoring"
                        className="place-items-center flex flex-col"
                    >
                        <div className="justify-self-start h-fit w-full text-center">
                            <GameLabel
                                className="mx-4 mt-8"
                                header="SCORE"
                                headerClassName="text-primary"
                                description={score}
                            />
                        </div>
                        <GameBoard />
                    </section>

                    <div
                        className={cn(
                            'my-8 flex flex-col justify-between items-center space-y-4',
                            { 'justify-end': gameMode === 'zen' },
                        )}
                    >
                        {gameMode === 'time-attack' && (
                            <GameLabel
                                header="TIMER"
                                description={
                                    timeLeft > 0 ? timeLeft - 1 : timeLeft
                                }
                            />
                        )}

                        <div className="flex flex-col gap-12 mb-10">
                            <Button
                                onClick={handleGameMode}
                                className="font-bold text-2xl text-success hover:brightness-120 select-none cursor-pointer transition-colors duration-200 text-left"
                                variant="link"
                            >
                                GAME MODES
                            </Button>

                            <Button
                                onClick={handleGameReset}
                                className="font-bold text-2xl text-destructive hover:brightness-120 select-none cursor-pointer transition-colors duration-200 text-left"
                                variant="link"
                            >
                                RESET GAME
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <GameModeSelector onStart={handleGameStart} />
            )}
        </main>
    );
}
