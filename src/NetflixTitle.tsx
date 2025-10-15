import React, { useCallback, useEffect, useRef, useState } from 'react';
import './NetflixTitle.css';
import netflixSound from './netflix-sound.mp3';
import { useNavigate } from 'react-router-dom';
import wordmarkImage from './images/wordmark.png';

const NAV_FALLBACK_DELAY_MS = 7000;

type NetflixTitleProps = {
  autoStart?: boolean;
};

const NetflixTitle: React.FC<NetflixTitleProps> = ({ autoStart = false }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigationTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio(netflixSound);
    audio.preload = 'auto';
    audio.loop = false;
    audio.muted = true;
    audio.volume = 0;
    (audio as any).playsInline = true;
    audioRef.current = audio;

    return () => {
      if (navigationTimeoutRef.current !== null) {
        window.clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const fadeInAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    const targetVolume = 1;
    const frameRate = 16;
    const fadeDuration = 320;
    const step = Math.max(targetVolume / (fadeDuration / frameRate), 0.08);

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

  const playIntroSound = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    const tryPlay = async (muted: boolean) => {
      audio.currentTime = 0;
      audio.muted = muted;
      audio.volume = muted ? 0 : 1;
      const playPromise = audio.play();
      if (playPromise) {
        await playPromise;
      }
    };

    try {
      await tryPlay(false);
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        try {
          await tryPlay(true);
          setTimeout(fadeInAudio, 80);
          return true;
        } catch (mutedError) {
          console.warn('Unable to start intro audio even after user interaction.', mutedError);
          return false;
        }
      }
      console.error('Intro audio failed to play.', error);
      return false;
    }
  }, [fadeInAudio]);

  const beginExperience = useCallback(
    async (forceStart?: boolean) => {
      if (hasStarted && !forceStart) return;

      await playIntroSound();
      setHasStarted(true);
    },
    [hasStarted, playIntroSound]
  );

  useEffect(() => {
    if (autoStart) {
      void beginExperience(true);
    }
  }, [autoStart, beginExperience]);

  useEffect(() => {
    if (!hasStarted) return;

    const clearNavigationTimer = () => {
      if (navigationTimeoutRef.current !== null) {
        window.clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
    };

    const scheduleNavigation = (delay: number) => {
      clearNavigationTimer();
      navigationTimeoutRef.current = window.setTimeout(() => {
        navigate('/browse');
      }, delay);
    };

    const audio = audioRef.current;

    if (!audio) {
      scheduleNavigation(NAV_FALLBACK_DELAY_MS);
      return clearNavigationTimer;
    }

    const estimatedDelay =
      audio.duration && Number.isFinite(audio.duration)
        ? Math.max((audio.duration - audio.currentTime) * 1000 + 900, 2800)
        : NAV_FALLBACK_DELAY_MS;

    scheduleNavigation(estimatedDelay);

    const handleEnded = () => {
      scheduleNavigation(900);
    };

    audio.addEventListener('ended', handleEnded, { once: true });

    return () => {
      audio.removeEventListener('ended', handleEnded);
      clearNavigationTimer();
    };
  }, [hasStarted, navigate]);

  return (
    <div
      className={`netflix-container ${!hasStarted && !autoStart ? 'netflix-container--awaiting' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => {
        void beginExperience();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          void beginExperience();
        }
      }}
      aria-label="Start portfolio intro"
    >
      <div
        className={`netflix-logo ${hasStarted ? 'animate' : ''}`}
        aria-label="Mohammed Azeezulla"
      >
        <img src={wordmarkImage} alt="Mohammed Azeezulla" />
      </div>
      {!hasStarted && !autoStart && (
        <div className="netflix-hint" aria-hidden="true">
          Tap or click anywhere to enter
        </div>
      )}
    </div>
  );
};

export default NetflixTitle;
