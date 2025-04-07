import type React from 'react';
import { cn } from '@/lib/utils';

interface GameLabel {
    header: string;
    description: string | number;
    headerClassName?: string;
    descriptionClassName?: string;
    className?: string;
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
    iconClassName?: string;
}

function GameLabel({
    header,
    description,
    headerClassName,
    descriptionClassName,
    className,
    Icon = null,
    iconClassName,
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
            <p
                className={cn(
                    'inline-flex items-center text-2xl',
                    descriptionClassName,
                )}
            >
                {description}
                {Icon && (
                    <Icon className={cn('h-auto w-auto', iconClassName)} />
                )}
            </p>
        </div>
    );
}

export { GameLabel };
