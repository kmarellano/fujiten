import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { GameMode, GameModeConfig } from '@/types';
import { Clock, Infinity, Target, ArrowDownUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface GameModeCardProps {
    mode: GameMode;
    config: GameModeConfig;
    onSelect: (mode: GameMode) => void;
    isSelected: boolean;
}

function GameModeCard({
    mode,
    config,
    onSelect,
    isSelected,
}: GameModeCardProps) {
    const modeIcon = useMemo(() => {
        switch (mode) {
            case 'zen':
                return (
                    <Infinity className="h-8 w-8 text-success animate-pulse" />
                );
            case 'time-attack':
                return (
                    <Clock className="h-8 w-8 text-highlight animate-pulse" />
                );
            case 'target-score':
                return (
                    <Target className="h-8 w-8 text-secondary animate-pulse" />
                );
            case 'cascade':
                return (
                    <ArrowDownUp className="h-8 w-8 text-accent animate-pulse" />
                );
            default:
                return null;
        }
    }, [mode]);

    return (
        <Card
            className={cn(
                'cursor-pointer transition-all hover:shadow-secondary hover:shadow-md',
                {
                    'ring-2 ring-accent shadow-md hover:shadow-accent':
                        isSelected,
                },
            )}
            onClick={() => onSelect(mode)}
        >
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    {modeIcon}
                    <span
                        className={cn('text-primary-foreground', {
                            'text-accent': isSelected,
                        })}
                    >
                        {config.name}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
                <CardDescription className="text-primary-foreground/90 min-h-28 text-xs leading-relaxed">
                    {config.description}
                </CardDescription>
            </CardContent>
        </Card>
    );
}

export { GameModeCard };
