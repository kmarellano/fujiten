'use client';

import { useEffect } from 'react';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="flex h-screen flex-col items-center justify-center bg-background">
                <div className="mx-auto flex max-w-md flex-col items-center justify-center space-y-6 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <CircleAlert className="text-destructive h-1/2 w-1/2" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter">
                        Something went wrong!
                    </h1>
                    <p className="text-muted-foreground">
                        An unexpected error has occurred. Please try again later
                        or contact support if the problem persists.
                        {error.digest && (
                            <span className="block text-sm text-gray-500 mt-2">
                                Error ID: {error.digest}
                            </span>
                        )}
                    </p>

                    {error.message && (
                        <pre className="mt-4 rounded-md bg-gray-100 p-3 text-sm text-gray-700">
                            {error.message}
                        </pre>
                    )}
                    <Button onClick={() => reset()} className="px-6">
                        Try again
                    </Button>
                </div>
            </body>
        </html>
    );
}
