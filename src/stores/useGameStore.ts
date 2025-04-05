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
    updateAnimatedApples: (gravity = 0.8) =>
        set((state) => ({
            animatedApples: state.animatedApples.map((apple) => ({
                ...apple,
                x: apple.x + apple.velocityX,
                y: apple.y + apple.velocityY,
                velocityY: apple.velocityY + gravity,
            })),
        })),
    setGameMode: (gameMode) => set(() => ({ gameMode })),

    resetPositions: () =>
        set(() => ({
            initialX: null,
            initialY: null,
            currentX: null,
            currentY: null,
            isSelecting: false,
            selectedCells: { numbers: [], positions: [], sum: 0 },
        })),
}));
