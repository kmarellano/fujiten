import type { GameMode, GameModeConfig } from '@/types';

export const gameModes: Record<GameMode, GameModeConfig> = {
    zen: {
        name: 'ZEN MODE',
        description:
            'Play at your own pace with no time limit. Relax and enjoy the game!',
        icon: 'infinity',
    },
    'time-attack': {
        name: 'TIME ATTACK',
        description:
            'Race against the clock! You have 60 seconds to score as many points as possible.',
        icon: 'clock',
    },
    'target-score': {
        name: 'TARGET SCORE',
        description:
            'Reach the target score with limited moves. Plan your selections carefully!',
        icon: 'target',
    },
    cascade: {
        name: 'CASCADE MODE',
        description:
            'When apples are removed, new ones fall from above to fill the empty spaces.',
        icon: 'arrow-down-up',
    },
};
