import React from 'react';
import { cn } from '@/lib/utils';

interface GameLabel {
    header: string;
    description: string | number;
    headerClassName?: string;
    descriptionClassName?: string;
    className?: string;
}

function GameLabel({
    header,
    description,
    headerClassName,
    descriptionClassName,
    className,
}: GameLabel) {
    return (
        <div className={cn('text-center', className)}>
            <h3
                className={cn(
                    'font-bold text-3xl text-accent',
                    headerClassName,
                )}
            >
                {header}
            </h3>
            <p className={cn('text-2xl', descriptionClassName)}>
                {description}
            </p>
        </div>
    );
}

export { GameLabel };
