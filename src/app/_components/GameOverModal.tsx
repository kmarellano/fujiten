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
    gameMode: GameMode;
    onRestart: () => void;
    onChangeMode: () => void;
    reason?: string;
    targetReached?: boolean;
}

export function GameOverModal({
    isOpen,
    score,
    gameMode,
    onRestart,
    onChangeMode,
    reason,
    targetReached,
}: GameOverModalProps) {
    const getTitle = () => {
        if (targetReached) return 'YOU WIN!';
        return 'GAME OVER';
    };

    const getMessage = () => {
        if (targetReached) return 'YOU REACHED THE TARGET SCORE!';

        switch (gameMode) {
            case 'time-attack':
            case 'multiplier':
                return "TIME'S UP! YOUR SCORE:";
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
                    <DialogTitle className="text-xl sm:text-2xl text-center">
                        {getTitle()}
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm sm:text-base">
                        {getMessage()}
                        <span className="block text-2xl sm:text-4xl font-bold arcade-text-glow mt-4 animate-pulse">
                            {score} PTS
                        </span>
                    </DialogDescription>
                </DialogHeader>

                {reason && (
                    <div className="bg-muted p-3 rounded-none border-2 border-primary/30 text-xs text-center">
                        {reason}
                    </div>
                )}

                <DialogFooter className="grid grid-cols-2 sm:gap-4 sm:items-end">
                    <Button
                        onClick={onChangeMode}
                        className="w-full sm:w-auto col-span-1 py-4 text-lg text-secondary hover:bg-secondary/10 hover:text-secondary-foreground bg-transparent arcade-button"
                    >
                        CHANGE MODE
                    </Button>

                    <Button
                        onClick={onRestart}
                        className="w-full sm:w-auto arcade-button col-span-1 py-4 text-lg"
                    >
                        PLAY AGAIN
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
