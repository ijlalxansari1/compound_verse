'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPanicState } from '@/lib/panic';

interface Track {
    id: string;
    name: string;
    url: string;
    icon: string;
    artist?: string;
    isCustom?: boolean;
}

// Calm ambient tracks for grounding mode
const GROUNDING_TRACKS: Track[] = [
    {
        id: 'rain',
        name: 'Gentle Rain',
        url: 'https://ia800504.us.archive.org/12/items/RainSounds/rain_sounds.mp3',
        icon: '🌧️'
    },
    {
        id: 'waves',
        name: 'Ocean Waves',
        url: 'https://ia800504.us.archive.org/12/items/OceanWaves/ocean_waves.mp3',
        icon: '🌊'
    }
];

// Classical music tracks for focus mode
const FOCUS_TRACKS: Track[] = [
    {
        id: 'vivaldi-winter',
        name: 'Vivaldi - Winter',
        artist: 'The Four Seasons',
        url: 'https://ia800504.us.archive.org/12/items/VivaldiWinter/01AllegroNonMolto.mp3',
        icon: '❄️'
    },
    {
        id: 'vivaldi-spring',
        name: 'Vivaldi - Spring',
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

const CUSTOM_TRACKS_KEY = 'compoundverse_custom_tracks';

type MusicMode = 'focus' | 'grounding' | 'custom';

interface MusicPlayerProps {
    mode?: MusicMode;
    autoPlayInGrounding?: boolean;
}

// Get saved custom tracks from localStorage
function getCustomTracks(): Track[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(CUSTOM_TRACKS_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch {
            return [];
        }
    }
    return [];
}

// Save custom tracks to localStorage
function saveCustomTracks(tracks: Track[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CUSTOM_TRACKS_KEY, JSON.stringify(tracks));
}

export default function MusicPlayer({ mode = 'focus', autoPlayInGrounding = false }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [volume, setVolume] = useState(0.3);
    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [musicMode, setMusicMode] = useState<MusicMode>(mode);
    const [isFading, setIsFading] = useState(false);
    const [customTracks, setCustomTracks] = useState<Track[]>([]);
    const [showUpload, setShowUpload] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Get tracks based on mode
    const getTracks = useCallback((): Track[] => {
        if (musicMode === 'custom') return customTracks;
        if (musicMode === 'grounding') return GROUNDING_TRACKS;
        return FOCUS_TRACKS;
    }, [musicMode, customTracks]);

    const TRACKS = getTracks();

    useEffect(() => {
        // Load custom tracks from storage
        setCustomTracks(getCustomTracks());

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
            if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
            }
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Check for panic/grounding mode
    useEffect(() => {
        const panicState = getPanicState();
        if (panicState.isActive && musicMode !== 'grounding') {
            setMusicMode('grounding');
            setCurrentTrack(0);
            if (autoPlayInGrounding) {
                fadeIn();
            }
        }
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    /**
     * Handle file upload
     */
    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const newTracks: Track[] = [];

        Array.from(files).forEach((file) => {
            if (file.type.startsWith('audio/')) {
                const url = URL.createObjectURL(file);
                const name = file.name.replace(/\.[^/.]+$/, ''); // Remove extension

                newTracks.push({
                    id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: name,
                    url: url,
                    icon: '🎵',
                    isCustom: true
                });
            }
        });

        if (newTracks.length > 0) {
            const updatedTracks = [...customTracks, ...newTracks];
            setCustomTracks(updatedTracks);
            saveCustomTracks(updatedTracks);
            setMusicMode('custom');
            setCurrentTrack(0);
            setShowUpload(false);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [customTracks]);

    /**
     * Remove a custom track
     */
    const removeCustomTrack = useCallback((trackId: string) => {
        const track = customTracks.find(t => t.id === trackId);
        if (track?.url.startsWith('blob:')) {
            URL.revokeObjectURL(track.url);
        }

        const updated = customTracks.filter(t => t.id !== trackId);
        setCustomTracks(updated);
        saveCustomTracks(updated);

        if (updated.length === 0) {
            setMusicMode('focus');
        }
        setCurrentTrack(0);
    }, [customTracks]);

    /**
     * Fade in audio smoothly
     */
    const fadeIn = useCallback(async () => {
        if (!audioRef.current) return;
        const tracks = getTracks();
        if (tracks.length === 0) {
            setError('No tracks available');
            return;
        }

        setIsFading(true);
        audioRef.current.volume = 0;
        audioRef.current.src = tracks[currentTrack]?.url || '';

        try {
            await audioRef.current.play();
            setIsPlaying(true);
            setError(null);

            // Fade in over 2 seconds
            let currentVol = 0;
            fadeIntervalRef.current = setInterval(() => {
                currentVol += 0.05;
                if (audioRef.current && currentVol <= volume) {
                    audioRef.current.volume = currentVol;
                } else {
                    if (fadeIntervalRef.current) {
                        clearInterval(fadeIntervalRef.current);
                    }
                    setIsFading(false);
                }
            }, 100);
        } catch (err) {
            setError('Click to enable audio');
            setIsFading(false);
        }
    }, [currentTrack, volume, getTracks]);

    /**
     * Fade out audio smoothly
     */
    const fadeOut = useCallback(() => {
        if (!audioRef.current || !isPlaying) return;

        setIsFading(true);
        let currentVol = audioRef.current.volume;

        fadeIntervalRef.current = setInterval(() => {
            currentVol -= 0.05;
            if (audioRef.current && currentVol > 0) {
                audioRef.current.volume = currentVol;
            } else {
                if (fadeIntervalRef.current) {
                    clearInterval(fadeIntervalRef.current);
                }
                if (audioRef.current) {
                    audioRef.current.pause();
                }
                setIsPlaying(false);
                setIsFading(false);
            }
        }, 100);
    }, [isPlaying]);

    /**
     * Instant kill switch - stops immediately
     */
    const killSwitch = useCallback(() => {
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setIsFading(false);
    }, []);

    const togglePlay = async () => {
        if (isFading) return; // Prevent spamming during fade

        if (isPlaying) {
            fadeOut();
        } else {
            fadeIn();
        }
    };

    const changeTrack = async (index: number) => {
        const tracks = getTracks();
        if (index >= tracks.length) return;

        setCurrentTrack(index);
        setError(null);

        if (audioRef.current && isPlaying) {
            // Fade out then switch
            fadeOut();
            setTimeout(async () => {
                if (audioRef.current) {
                    audioRef.current.src = tracks[index].url;
                    await fadeIn();
                }
            }, 500);
        }
    };

    const switchMode = (newMode: MusicMode) => {
        if (newMode === musicMode) return;
        if (newMode === 'custom' && customTracks.length === 0) {
            setShowUpload(true);
            return;
        }

        setMusicMode(newMode);
        setCurrentTrack(0);

        if (isPlaying) {
            fadeOut();
        }
    };

    const currentTrackData = TRACKS[currentTrack];

    return (
        <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
            />

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="music-player p-5 mb-3 min-w-[300px]"
                    >
                        {/* Mode Toggle */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => switchMode('focus')}
                                className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium ${musicMode === 'focus'
                                    ? 'bg-[#1cb0f6] text-white'
                                    : 'bg-[#21262d] text-[#8b949e]'
                                    }`}
                            >
                                🎵 Focus
                            </button>
                            <button
                                onClick={() => switchMode('grounding')}
                                className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium ${musicMode === 'grounding'
                                    ? 'bg-[#8b5cf6] text-white'
                                    : 'bg-[#21262d] text-[#8b949e]'
                                    }`}
                            >
                                🌊 Calm
                            </button>
                            <button
                                onClick={() => switchMode('custom')}
                                className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium ${musicMode === 'custom'
                                    ? 'bg-[#58cc02] text-white'
                                    : 'bg-[#21262d] text-[#8b949e]'
                                    }`}
                            >
                                📁 My Music
                            </button>
                        </div>

                        {/* Upload Section */}
                        {(showUpload || (musicMode === 'custom' && customTracks.length === 0)) && (
                            <div className="mb-4 p-4 bg-[#161b22] rounded-xl text-center">
                                <p className="text-sm text-[#8b949e] mb-3">
                                    Upload your own music files
                                </p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-[#58cc02] text-[#1a3a00] rounded-lg font-medium text-sm hover:bg-[#4caf00] transition-colors"
                                >
                                    📁 Choose Files
                                </button>
                                <p className="text-xs text-[#6e7681] mt-2">
                                    MP3, WAV, OGG supported
                                </p>
                            </div>
                        )}

                        {/* Current Track Info */}
                        {currentTrackData && (
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">{currentTrackData.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-sm truncate">{currentTrackData.name}</div>
                                    {currentTrackData.artist && (
                                        <div className="text-xs text-[#8b949e]">
                                            {currentTrackData.artist}
                                        </div>
                                    )}
                                </div>
                                {/* Kill Switch */}
                                <button
                                    onClick={killSwitch}
                                    className="w-8 h-8 rounded-full bg-[#21262d] flex items-center justify-center text-[#ff4b4b] hover:bg-[#ff4b4b] hover:text-white transition-colors flex-shrink-0"
                                    title="Stop immediately"
                                >
                                    ⏹
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="text-xs text-[#ff4b4b] mb-3 p-2 bg-[#ff4b4b]/10 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Track Selection */}
                        {TRACKS.length > 0 && (
                            <div className="flex gap-2 mb-4 flex-wrap">
                                {TRACKS.map((track, i) => (
                                    <div key={track.id} className="relative">
                                        <motion.button
                                            onClick={() => changeTrack(i)}
                                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${currentTrack === i
                                                ? musicMode === 'grounding'
                                                    ? 'bg-[#8b5cf6] text-white'
                                                    : musicMode === 'custom'
                                                        ? 'bg-[#58cc02] text-white'
                                                        : 'bg-[#1cb0f6] text-white'
                                                : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                                                }`}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span>{track.icon}</span>
                                        </motion.button>
                                        {/* Remove button for custom tracks */}
                                        {track.isCustom && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeCustomTrack(track.id);
                                                }}
                                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff4b4b] text-white text-xs flex items-center justify-center hover:bg-[#ea2b2b]"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {/* Add more button for custom mode */}
                                {musicMode === 'custom' && (
                                    <motion.button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] flex items-center gap-1"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>+</span>
                                    </motion.button>
                                )}
                            </div>
                        )}

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
                    className={`music-player w-16 h-16 rounded-full flex items-center justify-center shadow-xl ${musicMode === 'grounding' ? 'border-2 border-[#8b5cf6]'
                            : musicMode === 'custom' ? 'border-2 border-[#58cc02]'
                                : ''
                        }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.span
                        className="text-3xl"
                        animate={isPlaying ? { rotate: 360 } : {}}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                        {musicMode === 'grounding' ? '🌊' : musicMode === 'custom' ? '🎧' : '🎵'}
                    </motion.span>
                </motion.button>

                {/* Play/Pause Button */}
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                    }}
                    disabled={isFading || TRACKS.length === 0}
                    className={`absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${isPlaying
                        ? 'bg-[#ff4b4b] hover:bg-[#ea2b2b]'
                        : musicMode === 'grounding'
                            ? 'bg-[#8b5cf6] hover:bg-[#7c3aed]'
                            : musicMode === 'custom'
                                ? 'bg-[#58cc02] hover:bg-[#4caf00]'
                                : 'bg-[#1cb0f6] hover:bg-[#0095d4]'
                        } ${(isFading || TRACKS.length === 0) ? 'opacity-50' : ''}`}
                    whileTap={{ scale: 0.9 }}
                >
                    {isFading ? '...' : isPlaying ? '⏸' : '▶'}
                </motion.button>
            </div>
        </motion.div>
    );
}
