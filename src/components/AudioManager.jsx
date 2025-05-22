'use client'; // Ensures this runs on the client side
import { useEffect } from 'react';

const AudioManager = () => {
  useEffect(() => {
    const handleAudioPlayback = () => {
      document.querySelectorAll('audio').forEach((audio) => {
        if (document.hidden) {
          audio.pause();
        } else {
          audio.play();
        }
      });
    };

    document.addEventListener('visibilitychange', handleAudioPlayback);
    return () => {
      document.removeEventListener('visibilitychange', handleAudioPlayback);
    };
  }, []);

  return null; // No visible UI, just functionality
};

export default AudioManager;
