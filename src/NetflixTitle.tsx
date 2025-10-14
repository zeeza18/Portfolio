import React, { useCallback, useEffect, useRef, useState } from 'react';
import './NetflixTitle.css';
import netflixSound from './netflix-sound.mp3';
import { useNavigate } from 'react-router-dom';
import wordmarkImage from './images/wordmark.png';

const NetflixTitle = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const ensureAudio = useCallback(() => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(netflixSound);
      audio.preload = 'auto';
      audio.muted = false;
      audio.volume = 1;
      (audio as any).playsInline = true;
      audioRef.current = audio;
    }
    return audio;
  }, []);

  const playIntroSound = useCallback(async () => {
    const audio = ensureAudio();
    if (!audio) return false;

    try {
      audio.currentTime = 0;
      audio.volume = 1;
      audio.muted = false;
      await audio.play();
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        return false;
      }
      console.error('Audio play error:', error);
      return false;
    }
  }, [ensureAudio]);

  useEffect(() => {
    const attemptAutoplay = async () => {
      const success = await playIntroSound();
      if (!success) {
        console.warn(
          'Browser blocked autoplay for the intro sound. A user interaction will be required before audio can play.'
        );
      }
      setHasStarted(true);
    };

    attemptAutoplay();
  }, [playIntroSound]);

  useEffect(() => {
    if (!hasStarted) return;

    const timer = setTimeout(() => {
      navigate('/browse');
    }, 4000);

    return () => clearTimeout(timer);
  }, [hasStarted, navigate]);

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
