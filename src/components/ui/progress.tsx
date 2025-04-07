'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

function Progress({
    className,
    progressBarClassName,
    value = 0,
    ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
    progressBarClassName?: string;
}) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn(
                'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
                className,
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className={cn(
                    'bg-primary h-full w-full flex-1 transition-all',
                    progressBarClassName,
                )}
                style={{
                    height: `${((value || 0) / (props.max || 100)) * 100}%`,
                }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };
