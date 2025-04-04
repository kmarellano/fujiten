export class GridSolver {
    private grid: (number | null)[][];
    private validSets: number[][];
    private maxNumber: number;
    private gridVariance: number;

    constructor(
        gridRow: number,
        gridCol: number,
        validSets: number[][],
        maxNumber: number,
    ) {
        this.grid = Array(gridRow)
            .fill(null)
            .map(() => Array(gridCol).fill(null));
        this.validSets = validSets;
        this.maxNumber = maxNumber;
        this.gridVariance = 0.5;
    }

    private isSpaceAvailable(
        row: number,
        col: number,
        set: number[],
        isHorizontal: boolean,
    ): boolean {
        return set.every((_, i) => {
            const targetRow = isHorizontal ? row : row + i;
            const targetCol = isHorizontal ? col + i : col;
            return (
                this.grid[targetRow] && this.grid[targetRow][targetCol] === null
            );
        });
    }

    private placeSet(row: number, col: number, set: number[]): void {
        const isHorizontallyFit = col + set.length <= this.grid[0].length;
        const isVerticallyFit = row + set.length <= this.grid.length;

        const setToPlace =
            Math.random() > this.gridVariance ? set.reverse() : set;

        if (
            isHorizontallyFit &&
            this.isSpaceAvailable(row, col, set, true) &&
            Math.random() > this.gridVariance
        ) {
            setToPlace.forEach((num, i) => {
                this.grid[row][col + i] = num;
            });
        } else if (
            isVerticallyFit &&
            this.isSpaceAvailable(row, col, setToPlace, false)
        ) {
            setToPlace.forEach((num, i) => {
                this.grid[row + i][col] = num;
            });
        } else {
            setToPlace.forEach((num, i) => {
                this.grid[row][col + i] = num;
            });
        }
    }

    private generatePossibleSets(row: number, col: number): number[][] {
        return this.validSets.filter((set) => {
            const isHorizontallyFit = col + set.length <= this.grid[0].length;
            const isVerticallyFit = row + set.length <= this.grid.length;

            const canPlaceHorizontally =
                isHorizontallyFit &&
                set.every((_, i) => this.grid[row][col + i] === null);

            const canPlaceVertically =
                isVerticallyFit &&
                set.every(
                    (_, i) =>
                        this.grid[row + i] && this.grid[row + i][col] === null,
                );

            return canPlaceHorizontally || canPlaceVertically;
        });
    }

    private fillEmptyCells(): void {
        this.grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === null) {
                    this.grid[rowIndex][colIndex] =
                        Math.floor(Math.random() * this.maxNumber) + 1;
                }
            });
        });
    }

    public generateSolvableGrid(): (number | null)[][] {
        const positions = this.grid
            .flatMap((row, rowIndex) =>
                row.map((_, colIndex) => [rowIndex, colIndex]),
            )
            .sort(() => Math.random() - this.gridVariance);

        positions.forEach(([rowIndex, colIndex]) => {
            if (this.grid[rowIndex][colIndex] === null) {
                const possibleSets = this.generatePossibleSets(
                    rowIndex,
                    colIndex,
                );
                if (possibleSets.length > 0) {
                    const selectedSet =
                        possibleSets[
                            Math.floor(Math.random() * possibleSets.length)
                        ];
                    this.placeSet(rowIndex, colIndex, selectedSet);
                }
            }
        });

        this.fillEmptyCells();
        return this.grid;
    }
}
