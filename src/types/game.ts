export interface Position {
    x: number;
    y: number;
}

export type SelectedNumbers = number[];

export type CellMatrix = { row: number; col: number };
export type SelectedPositions = CellMatrix[];

export interface SelectedCells {
    numbers: SelectedNumbers;
    positions: SelectedPositions;
    sum: number;
}
export interface GameState {
    initialX: number | null;
    initialY: number | null;
    currentX: number | null;
    currentY: number | null;
    isSelecting: boolean;
    selectedCells: SelectedCells;
    animatedApples: AnimatedApple[];
    gameMode: GameMode | null;
    setInitialPosition: (x: number, y: number) => void;
    setCurrentPosition: (x: number, y: number) => void;
    setIsSelecting: (isSelecting: boolean) => void;
    setSelectedCells: (selectedCells: Omit<SelectedCells, 'sum'>) => void;
    setAnimatedApples: (animatedApples: AnimatedApple[]) => void;
    updateAnimatedApples: (gravity?: number) => void;
    setGameMode: (gameMode: GameMode) => void;
    resetPositions: () => void;
}

export interface SelectionBoxStyle {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface AnimatedApple {
    id: string;
    value: number;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    rotation: number;
}

export type GameMode = 'zen' | 'time-attack' | 'target-score' | 'cascade';
export interface GameModeConfig {
    name: string;
    description: string;
    icon: string;
}

export interface GameModeSelectorProps {
    onStart: (mode: GameMode) => void;
}
