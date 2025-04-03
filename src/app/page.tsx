'use client';

import {
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
    Fragment,
} from 'react';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/stores';
import { AppleIcon } from '@/components/AppleIcon';

import type React from 'react';
import type {
    Position,
    SelectionBoxStyle,
    CellMatrix,
    SelectedCells,
    SelectedNumbers,
    SelectedPositions,
} from '@/types';

const GRID_COL = 15;
const GRID_ROW = 10;
const MAX_NUMBER = 9;

export default function Home() {
    const {
        initialX,
        initialY,
        currentX,
        currentY,
        isSelecting,
        selectedCells,
        setIsSelecting,
        setInitialPosition,
        setCurrentPosition,
        setSelectedCells,
        resetPositions,
    } = useGameStore();

    const [grid, setGrid] = useState<number[][]>([]);
    const animationRef = useRef<number>(0);
    const lastUpdateRef = useRef<number>(0);
    const playgroundRef = useRef<HTMLDivElement>(null);
    const cellRefs = useRef<Array<Array<HTMLDivElement | null>>>([]);

    const generateRandomGrid = useCallback(() => {
        return Array.from({ length: GRID_ROW }, () =>
            Array.from(
                { length: GRID_COL },
                () => Math.floor(Math.random() * MAX_NUMBER) + 1,
            ),
        );
    }, []);

    useEffect(() => {
        setGrid(generateRandomGrid());
    }, [generateRandomGrid]);

    const getCurrentPosition = (
        ref: React.RefObject<HTMLDivElement | null>,
        e: React.MouseEvent,
    ): Position | undefined => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { x: fieldX, y: fieldY } = ref.current.getBoundingClientRect();

        const x = clientX - fieldX;
        const y = clientY - fieldY;

        return { x, y };
    };

    const handleMouseDown = useCallback(
        (e: React.MouseEvent): void => {
            const position = getCurrentPosition(playgroundRef, e);
            if (!position) return;

            const { x, y } = position;
            setIsSelecting(true);
            setInitialPosition(x, y);
        },
        [playgroundRef, setIsSelecting, setInitialPosition],
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
        (e: React.MouseEvent): void => {
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

    const handleMouseUp = useCallback(() => {
        setIsSelecting(false);
        resetPositions();

        cancelAnimationFrame(animationRef.current);
    }, [setIsSelecting, resetPositions]);

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseUp]);

    const getSelectionBoxStyle = (): SelectionBoxStyle | null => {
        if (
            !isSelecting ||
            initialX === null ||
            initialY === null ||
            currentX === null ||
            currentY === null
        )
            return null;

        const left = Math.min(initialX, currentX);
        const top = Math.min(initialY, currentY);
        const width = Math.abs(currentX - initialX);
        const height = Math.abs(currentY - initialY);

        return { left, top, width, height };
    };

    const selectedCellDesign = useMemo(() => {
        return (selected: CellMatrix) =>
            selectedCells.positions.some(
                (cell) =>
                    cell.row === selected.row && cell.col === selected.col,
            )
                ? {
                      highlight: '#ffb9b9',
                      stroke: '4',
                  }
                : {};
    }, [selectedCells]);

    const isUserPlaying =
        isSelecting && initialX && initialY && currentX && currentY;

    return (
        <section>
            <div
                className="grid grid-cols-15 grid-rows-10 mb-6 p-4 bg-accent border-2 border-accent-foreground w-fit min-w-[70rem] h-auto"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                ref={playgroundRef}
            >
                <Fragment>
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
                                <AppleIcon
                                    text={num !== null ? num : ''}
                                    size="sm"
                                    {...selectedCellDesign({
                                        row: rowIndex,
                                        col: colIndex,
                                    })}
                                />
                            </div>
                        ));
                    })}

                    {isUserPlaying && (
                        <div
                            className={cn(
                                'absolute border-2 border-destructive/80 bg-destructive/30 pointer-events-none z-10',
                                {
                                    'border-2 border-amber-200 bg-amber-400/40 shadow-lg':
                                        selectedCells.sum === 10,
                                },
                            )}
                            style={getSelectionBoxStyle() || {}}
                        ></div>
                    )}
                </Fragment>
            </div>
        </section>
    );
}
