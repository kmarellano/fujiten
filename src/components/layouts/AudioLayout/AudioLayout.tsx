import React, {
    useRef,
    useState,
    useEffect,
    ComponentType,
    ChangeEvent,
} from 'react';

import { Volume2, VolumeX } from 'lucide-react';

export interface AudioControls {
    playAudio: () => void;
    muteAudio: () => void;
    handleVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
    stopAudio: () => void;
    volume: number;
    isMuted: boolean;
}

export function withAudioLayout<P>(
    WrappedComponent: ComponentType<P & AudioControls>,
): React.FC<P> {
    const ComponentWithAudioLayout = (props: P) => {
        const audioRef = useRef<HTMLAudioElement>(null);
        const [volume, setVolume] = useState(1);
        const [isMuted, setIsMuted] = useState(false);

        useEffect(() => {
            if (audioRef.current) audioRef.current.volume = volume;
        }, [volume]);

        const playAudio = () => {
            if (!audioRef.current) return;
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        };

        const stopAudio = () => {
            if (!audioRef.current) return;
            audioRef.current.pause();
        };

        const muteAudio = () => {
            if (!audioRef.current) return;
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        };

        const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
            const v = Number(e.target.value) / 100;
            setVolume(v);
            if (audioRef.current) {
                audioRef.current.muted = false;
                setIsMuted(false);
            }
        };

        return (
            <div className="relative">
                <audio ref={audioRef} loop autoPlay>
                    <source src="backgroundmx.wav" type="audio/wav" />
                </audio>

                <WrappedComponent
                    {...props}
                    playAudio={playAudio}
                    muteAudio={muteAudio}
                    stopAudio={stopAudio}
                    handleVolumeChange={handleVolumeChange}
                    volume={volume}
                    isMuted={isMuted}
                />

                <div className="fixed bottom-4 left-4 flex items-center space-x-4 bg-gray-700 p-3 rounded-lg shadow-lg">
                    <button onClick={muteAudio}>
                        {isMuted ? (
                            <VolumeX size={20} />
                        ) : (
                            <Volume2 size={20} />
                        )}
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={volume * 100}
                        onChange={handleVolumeChange}
                        className="w-40"
                    />
                </div>
            </div>
        );
    };

    ComponentWithAudioLayout.displayName = `WithAudioLayout(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return ComponentWithAudioLayout;
}
