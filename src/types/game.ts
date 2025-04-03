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
    setInitialPosition: (x: number, y: number) => void;
    setCurrentPosition: (x: number, y: number) => void;
    setIsSelecting: (isSelecting: boolean) => void;
    setSelectedCells: (selectedCells: Omit<SelectedCells, 'sum'>) => void;
    resetPositions: () => void;
}

export interface SelectionBoxStyle {
    left: number;
    top: number;
    width: number;
    height: number;
}
