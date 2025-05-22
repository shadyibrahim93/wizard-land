'use client';
import { useEffect } from 'react';

const AudioManager = () => {
  useEffect(() => {
    const handleAudioPlayback = () => {
      const isHidden = document.hidden;

      // Pause/resume <audio> tags
      document.querySelectorAll('audio').forEach((audio) => {
        if (isHidden) {
          audio.pause();
        } else if (audio.paused) {
          audio.play().catch(() => {});
        }
      });

      // Pause/resume background music if available
      if (window.backgroundMusic instanceof HTMLAudioElement) {
        if (isHidden) {
          window.backgroundMusic.pause();
        } else if (window.backgroundMusic.paused) {
          window.backgroundMusic.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleAudioPlayback);

    return () => {
      document.removeEventListener('visibilitychange', handleAudioPlayback);
    };
  }, []);

  return null;
};

export default AudioManager;
