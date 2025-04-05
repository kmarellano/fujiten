import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export function GameModeCard({
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
                return <Clock className="h-8 w-8 text-primary animate-pulse" />;
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
                'cursor-pointer transition-all hover:shadow-accent hover:shadow-md',
                {
                    'ring-2 ring-secondary shadow-md hover:shadow-secondary':
                        isSelected,
                },
            )}
            onClick={() => onSelect(mode)}
        >
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    {modeIcon}
                    <span
                        className={cn({
                            'text-secondary': isSelected,
                        })}
                    >
                        {config.name}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full">
                <CardDescription className="min-h-[80px] text-xs leading-relaxed">
                    {config.description}
                </CardDescription>
                <Button
                    className={cn(
                        'w-full mt-4 text-xs py-3 bg-accent hover:bg-accent/90 text-accent-foreground',
                        {
                            'bg-secondary hover:bg-secondary/90 text-foreground':
                                isSelected,
                        },
                    )}
                    onClick={() => onSelect(mode)}
                >
                    {isSelected ? 'SELECTED' : 'SELECT'}
                </Button>
            </CardContent>
        </Card>
    );
}
