'use client';

import { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GameLabel } from '@/components/GameLabel';
import { GameBoard } from './_components/GameBoard';
import { GameOverModal } from './_components/GameOverModal';
import { GameModeSelector } from '@/components/GameModeSelector';
import { Zap } from 'lucide-react';

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
import { TA_TIMER, MULTIPLIER_COMBO_TIMER } from '@/config/gameConstants';
import { GameMode } from '@/types';

export default function Fujiten() {
    const {
        grid,
        score,
        gameMode,
        isGameOver,
        maxCombo,
        currentCombo,
        scoreMultiplier,
        setGrid,
        setGameMode,
        setIsGameOver,
        resetGame,
        resetScore,
        resetPositions,
        resetComboMultiplier,
    } = useGameStore();

    const isZEN = gameMode === 'zen';
    const isTA = gameMode === 'time-attack';
    const isMULTIPLIER = gameMode === 'multiplier';

    const {
        totalSeconds: timeLeft,
        start: startTimer,
        restart: restartTimer,
    } = useTimer({
        expiryTimestamp: generateDateInSeconds(TA_TIMER),
        autoStart: false,
    });

    const {
        totalSeconds: comboTimeLeft,
        start: startComboTimer,
        restart: restartComboTimer,
    } = useTimer({
        expiryTimestamp: generateDateInSeconds(MULTIPLIER_COMBO_TIMER),
        autoStart: false,
        onExpire: resetComboMultiplier,
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
            const newTimer = generateDateInSeconds(TA_TIMER);
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

        if (gameMode === 'multiplier') {
            startComboTimer();
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
        setIsGameOver(false);

        const isTimeAttack = gameMode === 'time-attack';
        handleResetTimer(isTimeAttack);

        const gridGenarated = generateGrid();
        setGrid(gridGenarated);
    };

    useEffect(() => {
        if (isZEN && grid.length > 0) {
            const hasMoves = GridSolver.hasPossibleSums(grid);
            if (!hasMoves) {
                setIsGameOver(true);
            }
        }
    }, [grid, isZEN, setIsGameOver]);

    useEffect(() => {
        if (isTA && grid.length > 0 && timeLeft <= 0) {
            setIsGameOver(true);
        }
    }, [grid, timeLeft, isTA, setIsGameOver]);

    const handleResetComboTimer = useCallback(() => {
        return restartComboTimer(
            generateDateInSeconds(MULTIPLIER_COMBO_TIMER),
            true,
        );
    }, [restartComboTimer]);

    return (
        <main className="min-h-screen max-h-screen">
            {gameMode ? (
                <div className="parent grid grid-cols-6 grid-rows-7 gap-0 min-h-screen min-w-full max-h-screen">
                    <div className="col-span-5 row-span-1 col-start-1 row-start-1 flex items-center justify-center">
                        <section
                            id="scoring"
                            className="place-items-center flex flex-col col-span-8"
                        >
                            <div
                                className={cn(
                                    'justify-self-start h-fit w-full text-center',
                                    {
                                        'grid grid-cols-3': isMULTIPLIER,
                                    },
                                )}
                            >
                                {isMULTIPLIER && (
                                    <div className="flex justify-start">
                                        <GameLabel
                                            header="COMBO"
                                            headerClassName="text-secondary"
                                            description={currentCombo}
                                            className="mx-4 mt-8"
                                        />
                                    </div>
                                )}

                                <GameLabel
                                    className="mx-4 mt-8"
                                    header="SCORE"
                                    headerClassName="text-primary"
                                    description={score}
                                />

                                {isMULTIPLIER && (
                                    <div className="flex justify-end">
                                        <GameLabel
                                            header="MULTIPLIER"
                                            description={`${scoreMultiplier}X`}
                                            headerClassName="text-purple-500"
                                            className="mx-4 mt-8 text-white"
                                            Icon={Zap}
                                            iconClassName={
                                                currentCombo <= 2
                                                    ? 'text-secondary animate-pulse fill-secondary/80'
                                                    : 'text-primary fill-primary/80 animate-pulse'
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-5 row-span-6 col-start-1 row-start-2 flex justify-center items-center relative">
                        <div className="absolute right-0 top-0 h-full flex items-center">
                            <div className="h-full w-3 py-12">
                                <Progress
                                    max={TA_TIMER}
                                    value={timeLeft}
                                    className="h-full rotate-180"
                                />
                            </div>
                        </div>
                        <GameBoard
                            hasOnGoingCombo={comboTimeLeft > 0}
                            restartComboTimer={handleResetComboTimer}
                        />
                    </div>

                    <div className="col-span-1 row-span-7 col-start-6 row-start-1 flex items-end justify-center">
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

            {gameMode && (
                <GameOverModal
                    score={score}
                    maxCombo={maxCombo}
                    isOpen={isGameOver}
                    gameMode={gameMode}
                    onChangeMode={handleGameMode}
                    onRestart={handleGameReset}
                />
            )}
        </main>
    );
}
