import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateDateInSeconds(seconds: number = 60): Date {
    return new Date(Date.now() + 1 * seconds * 1000);
}
