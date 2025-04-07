import type { GameMode, GameModeConfig } from '@/types';

export const gameModes: Record<GameMode, GameModeConfig> = {
    'time-attack': {
        name: 'TIME ATTACK',
        description:
            'Race against the clock! You have 60 seconds to score as many points as possible.',
        icon: 'clock',
    },
    zen: {
        name: 'ZEN MODE',
        description:
            'Play at your own pace with no time limit. Relax and enjoy the game!',
        icon: 'infinity',
    },
    multiplier: {
        name: 'MULTIPLIER MODE',
        description:
            'Build up combos with fast consecutive matches to multiply your score!',
        icon: 'target',
    },
    cascade: {
        name: 'CASCADE MODE',
        description:
            'When apples are removed, new ones fall from above to fill the empty spaces.',
        icon: 'arrow-down-up',
    },
};

export const TA_TIMER = 60;
export const REFILL_ON_COUNT = 2;
