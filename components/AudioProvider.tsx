'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  setPlaying: (playing: boolean) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element once on mount
  useEffect(() => {
    // Create audio element that persists across navigation
    if (!audioRef.current) {
      const audio = new Audio('/I_m_not_just_a_human_I_AM_A_SPIRIT_BEING_Apostle_Emmanuel_EtimMP3.mp3');
      audio.loop = true;
      audio.preload = 'auto';
      audioRef.current = audio;
    }

    // Load saved preference
    const savedState = localStorage.getItem('slic-nations-audio-playing');
    if (savedState === 'true') {
      setIsMuted(false);
      setIsPlaying(true);
    }

    return () => {
      // Don't destroy audio on unmount to persist across pages
    };
  }, []);

  // Control audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !isMuted) {
      audio.play().catch(() => {
        // Autoplay blocked, reset state
        setIsPlaying(false);
        setIsMuted(true);
      });
    } else {
      audio.pause();
    }

    // Save preference
    localStorage.setItem('slic-nations-audio-playing', String(isPlaying && !isMuted));
  }, [isPlaying, isMuted]);

  const togglePlay = () => {
    if (isMuted) {
      setIsMuted(false);
      setIsPlaying(true);
    } else {
      setIsMuted(true);
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setIsPlaying(true);
    }
  };

  const setPlaying = (playing: boolean) => {
    setIsPlaying(playing);
    if (playing) {
      setIsMuted(false);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, isMuted, togglePlay, toggleMute, setPlaying }}>
      {children}
    </AudioContext.Provider>
  );
}
