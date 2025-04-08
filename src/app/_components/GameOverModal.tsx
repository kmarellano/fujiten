'use client';

import { Button } from '@/components/ui/button';
import type { GameMode } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface GameOverModalProps {
    isOpen: boolean;
    score: number;
    maxCombo?: number;
    gameMode: GameMode;
    onRestart: () => void;
    onChangeMode: () => void;
    reason?: string;
}

export function GameOverModal({
    isOpen,
    score,
    maxCombo,
    gameMode,
    onRestart,
    onChangeMode,
}: GameOverModalProps) {
    const getMessage = () => {
        switch (gameMode) {
            case 'time-attack':
            case 'multiplier':
                return "TIME'S UP! YOUR FINAL SCORE:";
            default:
                return 'YOUR FINAL SCORE:';
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onChangeMode();
            }}
        >
            <DialogContent
                className="min-w-5/12 min-h-5/12"
                onInteractOutside={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogHeader className="justify-around">
                    <DialogTitle className="text-2xl sm:text-4xl text-center">
                        GAME OVER
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm sm:text-base flex flex-col justify-between gap-y-8">
                        {getMessage()}
                        <span className="block text-2xl sm:text-4xl font-bold arcade-text-glow mt-4 animate-pulse">
                            {score} PTS
                        </span>
                        {gameMode === 'multiplier' && (
                            <div className="bg-muted p-3 rounded-none border-2 border-primary/30 text-xs text-center">
                                MAX COMBO: {maxCombo}
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="grid grid-cols-2 sm:gap-4 sm:items-end">
                    <Button
                        onClick={onChangeMode}
                        className="w-full sm:w-auto col-span-1 py-4 text-secondary hover:bg-secondary/10 hover:text-secondary-foreground bg-transparent arcade-button text-xs md:text-base lg:text-lg"
                    >
                        CHANGE MODE
                    </Button>

                    <Button
                        onClick={onRestart}
                        className="w-full sm:w-auto arcade-button col-span-1 py-4 text-xs md:text-base lg:text-lg"
                    >
                        PLAY AGAIN
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
