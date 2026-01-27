'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Classical music tracks from Free Music Archive / Internet Archive (royalty-free)
const TRACKS = [
    {
        id: 'vivaldi-winter',
        name: 'Vivaldi - Winter (Allegro)',
        artist: 'The Four Seasons',
        // Public domain classical recordings
        url: 'https://ia800504.us.archive.org/12/items/VivaldiWinter/01AllegroNonMolto.mp3',
        icon: '❄️'
    },
    {
        id: 'vivaldi-spring',
        name: 'Vivaldi - Spring (Allegro)',
        artist: 'The Four Seasons',
        url: 'https://ia800504.us.archive.org/12/items/VivaldiSpring/VivaldiSpring.mp3',
        icon: '🌸'
    },
    {
        id: 'beethoven',
        name: 'Moonlight Sonata',
        artist: 'Beethoven',
        url: 'https://ia800504.us.archive.org/15/items/MoonlightSonata/MoonshineSonata.mp3',
        icon: '🌙'
    }
];

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [volume, setVolume] = useState(0.3);
    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element
        audioRef.current = new Audio();
        audioRef.current.volume = volume;
        audioRef.current.loop = true;

        // Handle errors
        audioRef.current.onerror = () => {
            setError('Could not load audio');
            setIsPlaying(false);
        };

        audioRef.current.oncanplay = () => {
            setError(null);
        };

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = async () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            try {
                audioRef.current.src = TRACKS[currentTrack].url;
                await audioRef.current.play();
                setIsPlaying(true);
                setError(null);
            } catch (err) {
                console.error('Playback failed:', err);
                setError('Click to enable audio');
            }
        }
    };

    const changeTrack = async (index: number) => {
        setCurrentTrack(index);
        setError(null);

        if (audioRef.current && isPlaying) {
            audioRef.current.src = TRACKS[index].url;
            try {
                await audioRef.current.play();
            } catch (err) {
                setError('Could not play track');
            }
        }
    };

    return (
        <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="music-player p-5 mb-3 min-w-[280px]"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">🎵</span>
                            <div>
                                <div className="font-bold text-sm">{TRACKS[currentTrack].name}</div>
                                <div className="text-xs text-[#8b949e]">{TRACKS[currentTrack].artist}</div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-xs text-[#ff4b4b] mb-3 p-2 bg-[#ff4b4b]/10 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Track Selection */}
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {TRACKS.map((track, i) => (
                                <motion.button
                                    key={track.id}
                                    onClick={() => changeTrack(i)}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${currentTrack === i
                                            ? 'bg-[#1cb0f6] text-white'
                                            : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                                        }`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span>{track.icon}</span>
                                    <span>{track.id.split('-')[1] || track.id}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Volume Control */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm">🔈</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="flex-1 h-2 bg-[#30363d] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#58cc02] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                            />
                            <span className="text-sm">🔊</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Button */}
            <div className="relative">
                <motion.button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="music-player w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.span
                        className="text-3xl"
                        animate={isPlaying ? { rotate: 360 } : {}}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                        🎵
                    </motion.span>
                </motion.button>

                {/* Play/Pause Button */}
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                    }}
                    className={`absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${isPlaying
                            ? 'bg-[#ff4b4b] hover:bg-[#ea2b2b]'
                            : 'bg-[#58cc02] hover:bg-[#4caf00]'
                        }`}
                    whileTap={{ scale: 0.9 }}
                >
                    {isPlaying ? '⏹' : '▶'}
                </motion.button>
            </div>
        </motion.div>
    );
}
