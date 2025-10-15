import React, { useCallback, useEffect, useRef, useState } from 'react';
import './NetflixTitle.css';
import netflixSound from './netflix-sound.mp3';
import { useNavigate } from 'react-router-dom';
import wordmarkImage from './images/wordmark.png';

const NetflixTitle = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [audioHasPlayed, setAudioHasPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);
  const navigate = useNavigate();

  // Create audio element immediately when component mounts
  useEffect(() => {
    const audio = new Audio(netflixSound);
    audio.preload = 'auto';
    audio.volume = 0;
    audio.muted = true;
    audio.loop = false;
    (audio as any).playsInline = true;
    audioRef.current = audio;

    // Try to unlock audio immediately with a silent play
    const unlockAudio = async () => {
      try {
        await audio.play();
        audioUnlockedRef.current = true;
        // Keep it playing muted initially
      } catch (e) {
        // Will be unlocked on first user interaction
        console.log('Audio context not unlocked yet, will retry on interaction');
      }
    };

    unlockAudio();

    return () => {
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

  // Main animation trigger - this should start when logo animation begins
  useEffect(() => {
    // Small delay to ensure audio element is ready
    const initTimer = setTimeout(() => {
      setHasStarted(true);

      // Start the animation and sound together
      const audio = audioRef.current;
      if (audio) {
        // Reset and unmute
        audio.currentTime = 0;
        audio.muted = false;
        audio.volume = 0;

        // Play and fade in
        audio.play()
          .then(() => {
            setAudioHasPlayed(true);
            fadeInAudio();
          })
          .catch((error) => {
            console.log('Autoplay blocked, waiting for user interaction');
            // Set up one-time interaction handlers
            const handleInteraction = () => {
              audio.currentTime = 0;
              audio.muted = false;
              audio.volume = 0;
              audio.play()
                .then(() => {
                  setAudioHasPlayed(true);
                  fadeInAudio();
                })
                .catch(console.error);
            };

            document.addEventListener('click', handleInteraction, { once: true });
            document.addEventListener('keydown', handleInteraction, { once: true });
            document.addEventListener('touchstart', handleInteraction, { once: true });
          });
      }
    }, 100);

    return () => {
      clearTimeout(initTimer);
    };
  }, [fadeInAudio]);

  useEffect(() => {
    if (!hasStarted) return;

    const delay = audioHasPlayed ? 4000 : 4600;
    const timer = window.setTimeout(() => {
      navigate('/browse');
    }, delay);

    return () => window.clearTimeout(timer);
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
