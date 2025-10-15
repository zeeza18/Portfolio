import React, { useCallback, useEffect, useRef, useState } from 'react';
import './NetflixTitle.css';
import netflixSound from './netflix-sound.mp3';
import { useNavigate } from 'react-router-dom';
import wordmarkImage from './images/wordmark.png';

const NetflixTitle = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [audioHasPlayed, setAudioHasPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const ensureAudio = useCallback(() => {
    let audio = audioRef.current;
    if (!audio) {
      audio = document.createElement('audio');
      audio.src = netflixSound;
      audio.preload = 'auto';
      audio.autoplay = true;
      audio.muted = true;
      audio.volume = 0;
      (audio as any).playsInline = true;
      audioRef.current = audio;
      document.body.appendChild(audio);
    }
    return audio;
  }, []);

  const fadeInAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    const targetVolume = 1;
    const frameRate = 16;
    const fadeDuration = 300;
    const step = Math.max(targetVolume / (fadeDuration / frameRate), 0.05);

    const ramp = () => {
      if (!audioRef.current) return;
      const nextVolume = Math.min(targetVolume, audioRef.current.volume + step);
      audioRef.current.volume = nextVolume;
      if (nextVolume < targetVolume) {
        setTimeout(ramp, frameRate);
      }
    };

    audio.volume = 0;
    ramp();
  }, []);

  const playIntroSound = useCallback(
    async (bootstrapMuted = false) => {
      const audio = ensureAudio();
      if (!audio) return false;

      try {
        audio.currentTime = 0;
        audio.muted = bootstrapMuted;
        audio.volume = bootstrapMuted ? 0 : 1;
        const playPromise = audio.play();
        if (playPromise) {
          await playPromise;
        }

        if (bootstrapMuted) {
          setTimeout(fadeInAudio, 80);
        }
        return true;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          return false;
        }
        console.error('Audio play error:', error);
        return false;
      }
    },
    [ensureAudio, fadeInAudio]
  );

  useEffect(() => {
    const removeUserActivationHandlers = () => {
      document.removeEventListener('pointerdown', handleUserActivation);
      document.removeEventListener('keydown', handleUserActivation);
    };

    const handleUserActivation = async () => {
      const success = await playIntroSound(false);
      if (success) {
        removeUserActivationHandlers();
        setAudioHasPlayed(true);
      }
    };

    const attemptAutoplay = async () => {
      let success = await playIntroSound(false);

      if (!success) {
        success = await playIntroSound(true);
      }

      if (success) {
        setAudioHasPlayed(true);
      } else {
        document.addEventListener('pointerdown', handleUserActivation, { once: true });
        document.addEventListener('keydown', handleUserActivation, { once: true });
        console.warn('Browser blocked autoplay for the intro sound. The audio will resume on your first interaction.');
      }
    };

    setHasStarted(true);
    attemptAutoplay();

    return () => {
      removeUserActivationHandlers();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.remove();
        audioRef.current = null;
      }
    };
  }, [playIntroSound]);

  useEffect(() => {
    if (!hasStarted || !audioHasPlayed) return;

    const timer = setTimeout(() => {
      navigate('/browse');
    }, 4000);

    return () => clearTimeout(timer);
  }, [audioHasPlayed, hasStarted, navigate]);

  return (
    <div
      className="netflix-container"
    >
      <div
        className={`netflix-logo ${hasStarted ? 'animate' : ''}`}
        aria-label="Mohammed Azeezulla"
      >
        <img src={wordmarkImage} alt="Mohammed Azeezulla" />
      </div>
    </div>
  );
};

export default NetflixTitle;
