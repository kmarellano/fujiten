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
                    'font-bold sm:text-2xl  2xl:text-3xl  text-accent text-base',
                    headerClassName,
                )}
            >
                {header}
            </h3>
            <p
                className={cn(
                    'inline-flex items-center sm:text-2xl text-xs',
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
