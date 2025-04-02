export interface Position {
    x: number;
    y: number;
}

export interface GameState {
    initialX: number;
    initialY: number;
    currentX: number;
    currentY: number;
    isSelecting: boolean;
    setInitialPosition: (x: number, y: number) => void;
    setCurrentPosition: (x: number, y: number) => void;
    setIsSelecting: (isSelecting: boolean) => void;
    resetPositions: () => void;
}
