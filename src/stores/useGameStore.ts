import { create } from 'zustand';
import { GameState } from '../types';

export const useGameStore = create<GameState>()((set) => ({
    initialX: 0,
    initialY: 0,
    currentX: 0,
    currentY: 0,
    isSelecting: false,

    setIsSelecting: (isSelecting) => set(() => ({ isSelecting })),
    setInitialPosition: (x, y) => set(() => ({ initialX: x, initialY: y })),
    setCurrentPosition: (x, y) => set(() => ({ currentX: x, currentY: y })),

    resetPositions: () =>
        set(() => ({
            initialX: 0,
            initialY: 0,
            currentX: 0,
            currentY: 0,
            isSelecting: false,
        })),
}));
