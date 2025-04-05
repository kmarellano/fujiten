import type { Metadata } from 'next';
import { Press_Start_2P } from 'next/font/google';
import '@/styles/globals.css';
import { SparklesCore } from '@/components/ui/sparkles';

const pressStart2P = Press_Start_2P({
    subsets: ['latin'],
    weight: '400',
    fallback: ['sans-serif'],
});
export const metadata: Metadata = {
    title: 'Fujiten',
    description:
        'FujiTen is a fun and intuitive puzzle game where you click and drag apples on a grid to form groups that sum to exactly 10',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${pressStart2P.className} antialiased`}>
                <div className="relative w-full bg-background overflow-hidden rounded-md">
                    <div className="w-full absolute inset-0 h-screen">
                        <SparklesCore
                            id="tsparticlesfullpage"
                            background="bg-background"
                            minSize={0.5}
                            maxSize={1}
                            particleDensity={100}
                            className="w-full h-full"
                            particleColor="#FFFFFF"
                        />
                    </div>
                    <div className="relative z-20 select-none">{children}</div>
                </div>
            </body>
        </html>
    );
}
