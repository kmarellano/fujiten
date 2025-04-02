'use client';

import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { AppleIcon } from '@/components/AppleIcon';
import { useGameStore } from '@/stores';

import type React from 'react';
import type { Position } from '@/types';

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
        setIsSelecting,
        setInitialPosition,
        setCurrentPosition,
    } = useGameStore();

    const [grid, setGrid] = useState<number[][]>([]);
    const playgroundRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>(0);
    const lastUpdateRef = useRef<number>(0);

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
            setCurrentPosition(x, y);
        },
        [playgroundRef, setIsSelecting, setInitialPosition, setCurrentPosition],
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent): void => {
            if (!isSelecting) return;

            const now = Date.now();
            if (now - lastUpdateRef.current < 17) return;
            lastUpdateRef.current = now;

            const position = getCurrentPosition(playgroundRef, e);
            if (!position) return;

            const { x, y } = position;
            window.requestAnimationFrame(() => {
                setCurrentPosition(x, y);
                animationRef.current = 1;
            });
        },
        [isSelecting, playgroundRef, setCurrentPosition],
    );

    const handleMouseUp = useCallback(() => {
        setIsSelecting(false);
        cancelAnimationFrame(animationRef.current);
    }, [setIsSelecting]);

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseUp]);

    const getSelectionBoxStyle = () => {
        if (!isSelecting || initialX === undefined || initialY === undefined)
            return null;

        const left = Math.min(initialX, currentX);
        const top = Math.min(initialY, currentY);
        const width = Math.abs(currentX - initialX);
        const height = Math.abs(currentY - initialY);

        return { left, top, width, height };
    };

    return (
        <section>
            <div
                className="grid grid-cols-15 grid-rows-10 gap-1 mb-6 p-4 bg-accent border-2 border-accent-foreground w-fit min-w-[60rem] h-auto"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                ref={playgroundRef}
            >
                <Fragment>
                    {grid.map((row, rowIndex) =>
                        row.map((num, colIndex) => (
                            <div key={`${rowIndex}-${colIndex}`}>
                                <AppleIcon
                                    text={num !== null ? num : ''}
                                    size="sm"
                                />
                            </div>
                        )),
                    )}

                    {isSelecting && (
                        <div
                            className="absolute border-2 border-destructive/80 bg-destructive/30 pointer-events-none z-10"
                            style={getSelectionBoxStyle() || {}}
                        ></div>
                    )}
                </Fragment>
            </div>
        </section>
    );
}
