import { create } from 'zustand';
import { GameState } from '@/types';

export const useGameStore = create<GameState>()((set) => ({
    grid: [],
    initialX: null,
    initialY: null,
    currentX: null,
    currentY: 0,
    isSelecting: false,
    selectedCells: { numbers: [], positions: [], sum: 0 },
    animatedApples: [],
    gameMode: null,
    score: 0,
    isGameOver: true,

    setGrid: (grid) => set(() => ({ grid })),
    setIsSelecting: (isSelecting) => set(() => ({ isSelecting })),
    setInitialPosition: (x, y) => set(() => ({ initialX: x, initialY: y })),
    setCurrentPosition: (x, y) => set(() => ({ currentX: x, currentY: y })),
    setSelectedCells: (selectedCells) =>
        set(() => ({
            selectedCells: {
                ...selectedCells,
                sum: selectedCells.numbers.reduce(
                    (prev, current) => prev + current,
                    0,
                ),
            },
        })),
    setAnimatedApples: (animatedApples) => set(() => ({ animatedApples })),
    setGameMode: (gameMode) => set(() => ({ gameMode, isGameOver: false })),
    setIsGameOver: (isGameOver) => set(() => ({ isGameOver })),

    updateAnimatedApples: (gravity = 1.5) =>
        set((state) => ({
            animatedApples: state.animatedApples.map((apple) => ({
                ...apple,
                x: apple.x + apple.velocityX,
                y: apple.y + apple.velocityY,
                velocityY: apple.velocityY + gravity,
            })),
        })),
    updateScore: () =>
        set((state) => ({
            score: state.score + state.selectedCells.numbers.length,
        })),

    deleteSelectedNumbers: () =>
        set((state) => {
            const newGrid = [...state.grid];

            state.selectedCells.positions.forEach(({ row, col }) => {
                newGrid[row][col] = null;
            });

            return { grid: newGrid };
        }),
    resetScore: () => set(() => ({ score: 0 })),
    resetPositions: () =>
        set(() => ({
            initialX: null,
            initialY: null,
            currentX: null,
            currentY: null,
            isSelecting: false,
            selectedCells: { numbers: [], positions: [], sum: 0 },
        })),
    resetGame: () =>
        set(() => ({
            score: 0,
            gameMode: null,
            isGameOver: true,
        })),
}));
