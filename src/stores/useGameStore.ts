import { create } from 'zustand';
import { GameState } from '@/types';
import { MAX_NUMBER } from '@/config/gridConstants';

function getMultiplier(comboCount: number) {
    const LIMIT_COMBO_MULTIPLIER = 3;
    const MAX_COMBO_MULTIPLIER = 10;

    if (comboCount === 0) return 1;
    if (comboCount <= 5) return 1 + (comboCount - 1) * 0.5;
    if (comboCount < 8) return LIMIT_COMBO_MULTIPLIER;

    return MAX_COMBO_MULTIPLIER;
}

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
    deletionCount: 0,
    recentlyRemovedCells: [],
    maxCombo: 0,
    currentCombo: 0,
    scoreMultiplier: 1,

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
    updateScore: (isCombo) =>
        set((state) => {
            const isMULTIPLIER = state.gameMode === 'multiplier';

            const comboCounter = state.currentCombo + 1;
            let scoreMultiplier = 1;
            if (isMULTIPLIER && isCombo) {
                scoreMultiplier = getMultiplier(comboCounter);
            }

            const currentMaxCombo =
                comboCounter > state.maxCombo ? comboCounter : state.maxCombo;

            const multiplierPayload = {
                currentCombo: comboCounter,
                scoreMultiplier,
                maxCombo: currentMaxCombo,
            };

            return {
                score:
                    state.score +
                    state.selectedCells.numbers.length * scoreMultiplier,
                ...(isMULTIPLIER ? multiplierPayload : {}),
            };
        }),

    deleteSelectedNumbers: (shouldRefill = false, refillOnCount = 1) =>
        set((state) => {
            const newGrid = [...state.grid];

            const currentPositions = state.selectedCells.positions;
            currentPositions.forEach(({ row, col }) => {
                newGrid[row][col] = null;
            });

            const shouldUpdate =
                shouldRefill && state.deletionCount % refillOnCount === 0;

            if (shouldUpdate) {
                state.recentlyRemovedCells.forEach(({ row, col }) => {
                    newGrid[row][col] =
                        Math.floor(Math.random() * MAX_NUMBER) + 1;
                });
            }

            return {
                grid: newGrid,
                deletionCount: state.deletionCount + 1,
                recentlyRemovedCells: shouldUpdate
                    ? currentPositions
                    : state.recentlyRemovedCells,
            };
        }),

    resetScore: () =>
        set(() => ({
            score: 0,
            scoreMultiplier: 1,
            currentCombo: 0,
            maxCombo: 0,
        })),

    resetComboMultiplier: () =>
        set(() => ({ scoreMultiplier: 1, currentCombo: 0 })),

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
            grid: [],
            score: 0,
            gameMode: null,
            isGameOver: true,
            deletionCount: 0,
            recentlyRemovedPositions: [],
            scoreMultiplier: 1,
            currentCombo: 0,
            maxCombo: 0,
        })),
}));
