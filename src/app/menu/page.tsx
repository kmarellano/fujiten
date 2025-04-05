'use client';

import { useState } from 'react';
import { GameModeCard } from './_components';
import { Button } from '@/components/ui/button';

import { PlayIcon } from 'lucide-react';
import { gameModes } from '@/src/config/gameConstants';

import type { GameMode } from '@/types';

interface GameModeSelectorProps {
    onStart: (mode: GameMode) => void;
}

export default function GameModeSelector({ onStart }: GameModeSelectorProps) {
    const [selectedMode, setSelectedMode] = useState<GameMode>('zen');

    const handleSelect = (mode: GameMode) => {
        setSelectedMode(mode);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-foreground shadow-2xl animate-pulse duration-500">
                SELECT GAME MODE
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(gameModes) as GameMode[]).map((mode) => (
                    <GameModeCard
                        key={mode}
                        mode={mode}
                        config={gameModes[mode]}
                        onSelect={handleSelect}
                        isSelected={selectedMode === mode}
                    />
                ))}
            </div>

            <Button
                className="w-full mt-6 py-6 text-base sm:text-lg bg-primary hover:bg-primary/90"
                onClick={() => onStart(selectedMode)}
            >
                <PlayIcon className="mr-2 h-5 w-5" fill="white" /> START GAME
            </Button>
        </div>
    );
}
