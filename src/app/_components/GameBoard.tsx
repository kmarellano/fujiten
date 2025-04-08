'use client';

import { useEffect, useCallback, useRef, useMemo } from 'react';
import { useGameStore } from '@/stores';
import { AppleIcon } from '@/components/AppleIcon';
import { Progress } from '@/components/ui/progress';

import { cn } from '@/lib/utils';
import {
    REFILL_ON_COUNT,
    TA_TIMER,
    MULTIPLIER_COMBO_TIMER,
} from '@/src/config/gameConstants';
import { GRID_COL, GRID_ROW, MAX_NUMBER } from '@/config/gridConstants';

import type React from 'react';
import type {
    Position,
    SelectionBoxStyle,
    CellMatrix,
    SelectedCells,
    SelectedNumbers,
    SelectedPositions,
    AnimatedApple,
} from '@/types';
import { Timer, Zap } from 'lucide-react';

interface GameBoardProps {
    hasOnGoingCombo?: boolean;
    restartComboTimer?: () => void;
    gameTimer: number;
    comboTimer: number;
}

function GameBoard({
    gameTimer,
    comboTimer,
    hasOnGoingCombo,
    restartComboTimer,
}: GameBoardProps) {
    const {
        grid,
        gameMode,
        initialX,
        initialY,
        currentX,
        currentY,
        isSelecting,
        selectedCells,
        animatedApples,
        setIsSelecting,
        setInitialPosition,
        setCurrentPosition,
        setSelectedCells,
        setAnimatedApples,
        updateScore,
        updateAnimatedApples,
        deleteSelectedNumbers,
        resetPositions,
    } = useGameStore();

    const isCASCADE = gameMode === 'cascade';
    const isMULTIPLIER = gameMode === 'multiplier';
    const isTA = gameMode === 'time-attack';

    const hasGameTimer = isMULTIPLIER || isTA;
    const hasComboTimer = isMULTIPLIER;

    const animationRef = useRef<number>(0);
    const lastUpdateRef = useRef<number>(0);
    const playgroundRef = useRef<HTMLDivElement>(null);
    const cellRefs = useRef<Array<Array<HTMLDivElement | null>>>([]);

    const getCurrentPosition = (
        ref: React.RefObject<HTMLDivElement | null>,
        e: React.MouseEvent | React.TouchEvent,
    ): Position | undefined => {
        if (!ref.current) return;

        let clientX: number;
        let clientY: number;

        if ('touches' in e) {
            const touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const { x: fieldX, y: fieldY } = ref.current.getBoundingClientRect();

        const x = clientX - fieldX;
        const y = clientY - fieldY;
        return { x, y };
    };

    const handleMouseDown = useCallback(
        (e: React.MouseEvent | React.TouchEvent): void => {
            resetPositions();
            const position = getCurrentPosition(playgroundRef, e);
            if (!position) return;

            const { x, y } = position;
            setIsSelecting(true);
            setInitialPosition(x, y);
        },
        [playgroundRef, setIsSelecting, setInitialPosition, resetPositions],
    );

    const findNumbersInSelectionBox = useCallback(
        (start: Position, end: Position): Omit<SelectedCells, 'sum'> => {
            const left = Math.min(start.x, end.x);
            const right = Math.max(start.x, end.x);
            const top = Math.min(start.y, end.y);
            const bottom = Math.max(start.y, end.y);

            const selectedNums: SelectedNumbers = [];
            const selectedPos: SelectedPositions = [];

            cellRefs.current.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    if (cell && grid[rowIndex][colIndex] !== null) {
                        const cellRect = cell.getBoundingClientRect();
                        const gridRect =
                            playgroundRef.current!.getBoundingClientRect();

                        const cellLeft = cellRect.left - gridRect.left;
                        const cellRight = cellRect.right - gridRect.left;
                        const cellTop = cellRect.top - gridRect.top;
                        const cellBottom = cellRect.bottom - gridRect.top;

                        const innerLeft =
                            cellLeft + (cellRight - cellLeft) * 0.3;
                        const innerRight =
                            cellRight - (cellRight - cellLeft) * 0.3;
                        const innerTop = cellTop + (cellBottom - cellTop) * 0.3;
                        const innerBottom =
                            cellBottom - (cellBottom - cellTop) * 0.3;

                        if (
                            innerRight >= left &&
                            innerLeft <= right &&
                            innerBottom >= top &&
                            innerTop <= bottom
                        ) {
                            const selectedNumber = grid[rowIndex][colIndex];
                            selectedNums.push(selectedNumber);
                            selectedPos.push({ row: rowIndex, col: colIndex });
                        }
                    }
                });
            });

            return { numbers: selectedNums, positions: selectedPos };
        },
        [grid, cellRefs, playgroundRef],
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent | React.TouchEvent): void => {
            if (!isSelecting || !initialX || !initialY) return;

            const now = Date.now();
            if (now - lastUpdateRef.current < 17) return;
            lastUpdateRef.current = now;

            const position = getCurrentPosition(playgroundRef, e);
            if (!position) return;

            const { x, y } = position;
            window.requestAnimationFrame(() => {
                const { numbers, positions } = findNumbersInSelectionBox(
                    { x: initialX, y: initialY },
                    { x, y },
                );
                setSelectedCells({ numbers, positions });
                setCurrentPosition(x, y);
                animationRef.current = 1;
            });
        },
        [
            initialX,
            initialY,
            isSelecting,
            playgroundRef,
            setSelectedCells,
            setCurrentPosition,
            findNumbersInSelectionBox,
        ],
    );

    const createAnimatedApples = useCallback(() => {
        const newAnimatedApples = selectedCells.positions
            .map((pos, index) => {
                const cell = cellRefs.current[pos.row][pos.col];
                if (!cell || !playgroundRef.current) return null;

                const cellRect = cell.getBoundingClientRect();
                const velocityX = 5;
                return {
                    id: `${pos.row}-${pos.col}`,
                    x: cellRect.left,
                    y: cellRect.top,
                    value: selectedCells.numbers[index],
                    velocityX: index % 2 === 0 ? -velocityX : velocityX,
                    velocityY: -10,
                    rotation: 360,
                };
            })
            .filter(Boolean) as AnimatedApple[];

        setAnimatedApples(newAnimatedApples);
    }, [selectedCells, cellRefs, playgroundRef, setAnimatedApples]);

    useEffect(() => {
        if (animatedApples.length === 0) return;

        let rafId: number;
        const gravity = 1.5;

        const animate = () => {
            updateAnimatedApples(gravity);
            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [animatedApples.length, updateAnimatedApples]);

    const handleMouseUp = useCallback(() => {
        if (selectedCells.sum === MAX_NUMBER + 1) {
            createAnimatedApples();
            deleteSelectedNumbers(isCASCADE, REFILL_ON_COUNT);

            const keepCombo = gameMode === 'multiplier' && !!hasOnGoingCombo;
            restartComboTimer?.();
            updateScore(keepCombo);
        }

        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
        resetPositions();
    }, [
        gameMode,
        isCASCADE,
        selectedCells,
        hasOnGoingCombo,
        updateScore,
        resetPositions,
        createAnimatedApples,
        deleteSelectedNumbers,
        restartComboTimer,
    ]);

    useEffect(() => {
        const handleUp = () => handleMouseUp();
        document.addEventListener('mouseup', handleUp);
        document.addEventListener('touchend', handleUp);
        return () => {
            document.removeEventListener('mouseup', handleUp);
            document.removeEventListener('touchend', handleUp);
        };
    }, [handleMouseUp]);

    const getSelectionBoxStyle = (): SelectionBoxStyle | null => {
        if (
            !isSelecting ||
            initialX === null ||
            initialY === null ||
            currentX === null ||
            currentY === null ||
            !playgroundRef.current
        )
            return null;

        const left = Math.min(initialX, currentX);
        const top = Math.min(initialY, currentY);
        const width = Math.abs(currentX - initialX);
        const height = Math.abs(currentY - initialY);

        return {
            left: left,
            top: top,
            width,
            height,
        };
    };

    const selectedCellDesign = useMemo(() => {
        return (selected: CellMatrix) =>
            isSelecting &&
            selectedCells.positions.some(
                (cell) =>
                    cell.row === selected.row && cell.col === selected.col,
            )
                ? {
                      highlight: '#ffb9b9',
                      stroke: '4',
                  }
                : {};
    }, [isSelecting, selectedCells]);

    const isUserPlaying =
        isSelecting && initialX && initialY && currentX && currentY;

    return (
        <section id="game-board" className="relative h-full w-full">
            <div
                className="grid h-full w-full p-12 select-none touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                onTouchCancel={handleMouseUp}
                ref={playgroundRef}
                style={{
                    gridTemplateColumns: `repeat(${GRID_COL}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${GRID_ROW}, minmax(0, 1fr))`,
                }}
            >
                {grid.map((row, rowIndex) => {
                    if (!cellRefs.current[rowIndex]) {
                        cellRefs.current[rowIndex] = [];
                    }

                    return row.map((num, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            ref={(el) => {
                                cellRefs.current[rowIndex][colIndex] = el;
                            }}
                        >
                            {num !== null && (
                                <AppleIcon
                                    size="full"
                                    text={num}
                                    {...selectedCellDesign({
                                        row: rowIndex,
                                        col: colIndex,
                                    })}
                                />
                            )}
                        </div>
                    ));
                })}
            </div>

            {isUserPlaying && (
                <div
                    className={cn(
                        'absolute border-2 border-destructive/80 bg-destructive/30 pointer-events-none z-10',
                        {
                            'border-2 border-amber-200 bg-amber-400/40 shadow-lg':
                                selectedCells.sum === MAX_NUMBER + 1,
                        },
                    )}
                    style={getSelectionBoxStyle() || {}}
                ></div>
            )}

            {animatedApples.map((apple) => (
                <div
                    key={apple.id}
                    className="absolute pointer-events-none animate-pop"
                    style={{
                        position: 'fixed',
                        left: `${apple.x}px`,
                        top: `${apple.y}px`,
                        transform: `translate(-50%, -50%) rotate(${apple.rotation}deg))`,
                    }}
                >
                    <AppleIcon text={apple.value} size="sm" />
                </div>
            ))}

            {(hasGameTimer || hasComboTimer) && (
                <div className="absolute right-0 top-0 h-full flex items-center gap-x-4 pb-12">
                    {hasComboTimer && (
                        <div className="flex flex-col h-full w-2 sm:w-4 gap-y-4 items-center">
                            <Zap className="w-6 h-6 text-cyan-300" />
                            <Progress
                                max={MULTIPLIER_COMBO_TIMER}
                                value={comboTimer}
                                className="h-full rotate-180 w-full bg-secondary/10"
                                progressBarClassName="bg-secondary"
                            />
                        </div>
                    )}

                    {hasGameTimer && (
                        <div className="flex flex-col h-full w-2 sm:w-4 gap-y-4 items-center">
                            <Timer
                                className={cn('w-6 h-6 text-green-400', {
                                    'text-primary':
                                        (gameTimer / TA_TIMER) * 100 < 20,
                                    'text-warning':
                                        (gameTimer / TA_TIMER) * 100 < 60,
                                })}
                            />
                            <Progress
                                max={TA_TIMER}
                                value={gameTimer}
                                className={cn(
                                    'h-full rotate-180 w-full bg-green/10',
                                    {
                                        'bg-primary/10':
                                            (gameTimer / TA_TIMER) * 100 < 20,
                                        'bg-warning/10':
                                            (gameTimer / TA_TIMER) * 100 < 60,
                                    },
                                )}
                                progressBarClassName={cn('bg-green-400', {
                                    'bg-primary':
                                        (gameTimer / TA_TIMER) * 100 < 20,
                                    'bg-warning':
                                        (gameTimer / TA_TIMER) * 100 < 60,
                                })}
                            />
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export { GameBoard };
