'use client';

import { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GameLabel } from '@/components/GameLabel';
import { GameBoard } from './_components/GameBoard';
import { GameOverModal } from './_components/GameOverModal';
import { GameModeSelector } from '@/components/GameModeSelector';
import {
    withAudioLayout,
    AudioControls,
} from '@/components/layouts/AudioLayout';

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

interface FujitenProps extends AudioControls {}

function Fujiten({ playAudio, stopAudio }: FujitenProps) {
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
    const isCASCADE = gameMode === 'cascade';

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

    const handleResetComboTimer = useCallback(
        (autoStart: boolean = true) => {
            const newComboTimer = generateDateInSeconds(MULTIPLIER_COMBO_TIMER);
            restartComboTimer(newComboTimer, autoStart);
        },
        [restartComboTimer],
    );

    const handleGameStart = (gameMode: GameMode): void => {
        playAudio();

        const gridGenarated = generateGrid();
        setGrid(gridGenarated);

        if (gameMode === 'time-attack' || gameMode === 'multiplier')
            startTimer();

        if (gameMode === 'multiplier') startComboTimer();

        resetScore();
        resetPositions();
        setGameMode(gameMode);
    };

    const handleGameMode = (): void => {
        resetGame();
        handleResetTimer(false);
        handleResetComboTimer(false);
        stopAudio();
    };

    const handleGameReset = (): void => {
        resetScore();
        resetPositions();
        setIsGameOver(false);

        const isMultiplier = gameMode === 'multiplier';
        const isTimeAttack = gameMode === 'time-attack';

        handleResetTimer(isTimeAttack || isMULTIPLIER);
        handleResetComboTimer(isMultiplier);

        const gridGenarated = generateGrid();
        setGrid(gridGenarated);
    };

    useEffect(() => {
        if ((isZEN || isCASCADE) && grid.length > 0) {
            const hasMoves = GridSolver.hasPossibleSums(grid);
            if (!hasMoves) {
                setIsGameOver(true);
            }
        }
    }, [grid, isZEN, isCASCADE, setIsGameOver]);

    useEffect(() => {
        if ((isTA || isMULTIPLIER) && grid.length > 0 && timeLeft <= 0) {
            setIsGameOver(true);
        }
    }, [grid, timeLeft, isTA, isMULTIPLIER, setIsGameOver]);

    return (
        <main className="sm:max-h-screen sm:min-h-fit min-h-screen overflow-auto">
            {gameMode ? (
                <div className="parent flex flex-col 2xl:grid-cols-6 2xl:grid-rows-7 gap-0 2xl:grid max-h-screen max-w-screen overflow-hidden">
                    <div className="col-span-5 row-span-1 col-start-1 row-start-1 flex items-center justify-center px-4 py-2">
                        <section
                            id="scoring"
                            className="w-full flex items-center justify-center"
                        >
                            <div
                                className={cn(
                                    'w-full text-center grid gap-4 grid-cols-1',
                                    {
                                        'sm:grid-cols-3': isMULTIPLIER,
                                    },
                                )}
                            >
                                {isMULTIPLIER && (
                                    <div className="flex justify-center sm:justify-start">
                                        <GameLabel
                                            header="COMBO"
                                            headerClassName="text-secondary"
                                            description={currentCombo}
                                            className="mx-2"
                                        />
                                    </div>
                                )}

                                <div className="flex justify-center">
                                    <GameLabel
                                        className="mx-2"
                                        header="SCORE"
                                        headerClassName="text-primary"
                                        description={score}
                                    />
                                </div>

                                {isMULTIPLIER && (
                                    <div className="flex justify-center sm:justify-end">
                                        <GameLabel
                                            header="MULTIPLIER"
                                            description={`${scoreMultiplier}X`}
                                            headerClassName="text-purple-500"
                                            className="mx-2 text-white"
                                            Icon={Zap}
                                            iconClassName={
                                                currentCombo <= 5
                                                    ? 'text-secondary animate-pulse fill-secondary/80'
                                                    : 'text-primary fill-primary/80 animate-pulse'
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-5 row-span-6 col-start-1 row-start-2 flex justify-center w-full h-full">
                        <GameBoard
                            gameTimer={timeLeft}
                            comboTimer={comboTimeLeft}
                            hasOnGoingCombo={comboTimeLeft > 0}
                            restartComboTimer={handleResetComboTimer}
                        />
                    </div>

                    <div className="col-span-1 row-span-7 col-start-6 row-start-1 flex flex-col gap-4 items-center justify-end h-full py-4 2xl:flex-col 2xl:gap-y-16 2xl:justify-end 2xl:items-center">
                        <Button
                            onClick={handleGameMode}
                            className="font-bold text-lg sm:text-xl 2xl:text-2xl text-success hover:brightness-120 select-none cursor-pointer transition-colors duration-200 text-center"
                            variant="link"
                        >
                            GAME MODES
                        </Button>

                        <Button
                            onClick={handleGameReset}
                            className="font-bold text-lg sm:text-xl 2xl:text-2xl text-destructive hover:brightness-120 select-none cursor-pointer transition-colors duration-200 text-center"
                            variant="link"
                        >
                            RESET GAME
                        </Button>
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

export default withAudioLayout(Fujiten);
