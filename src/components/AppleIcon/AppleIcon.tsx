import { AppleIconProps } from '@/types';

const sizeMap = {
    sm: 75,
    md: 120,
    lg: 180,
    xl: 240,
    '2xl': 300,
};

function AppleIcon({
    text = 1,
    size = 'md',
}: AppleIconProps & { size: keyof typeof sizeMap }) {
    const svgSize = sizeMap[size as keyof typeof sizeMap];

    return (
        <svg
            width={svgSize}
            height={svgSize}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient
                    id="appleGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stopColor="#ff6b6b" />
                    <stop offset="100%" stopColor="red" />
                </linearGradient>
            </defs>

            <path
                d="M32 56c-7 0-13-4-16-9C11 41 9 34 9 28c0-8 6-15 13-15 3 0 6 2 10 2s7-2 10-2c7 0 13 7 13 15 0 6-2 13-7 19-3 5-9 9-16 9Z"
                fill="url(#appleGradient)"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
            />

            <ellipse
                cx="24"
                cy="28"
                rx="4"
                ry="6"
                fill="white"
                fillOpacity="0.4"
                transform="rotate(-15 24 28)"
            />

            <path
                d="M38 10c-3-2-6 0-7 2-1 2 0 5 2 6 2 1 5 0 6-2 1-2 1-5-1-6Z"
                fill="#4CAF50"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
            />

            <text
                x="50%"
                y="50%"
                fontSize="20"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle"
                className="select-none"
            >
                {text}
            </text>
        </svg>
    );
}

export { AppleIcon };
