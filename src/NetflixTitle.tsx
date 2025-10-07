import React, { useCallback, useEffect, useRef, useState } from 'react';
import './NetflixTitle.css';
import netflixSound from './netflix-sound.mp3';
import { useNavigate } from 'react-router-dom';
import wordmarkImage from './images/wordmark.png';

const NetflixTitle = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio(netflixSound);
    audio.preload = 'auto';
    audio.muted = true;
    audioRef.current = audio;
  }, []);

  const triggerIntro = useCallback((fromUserGesture = false) => {
    if (hasStarted) return;

    const attemptPlay = async () => {
      try {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = 0;
        audio.volume = 1;
        audio.muted = !fromUserGesture;

        await audio.play();

        if (!fromUserGesture) {
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.muted = false;
            }
          }, 150);
        }
      } catch (error) {
        console.error('Audio play error:', error);
      }
    };

    attemptPlay();
    setHasStarted(true);
  }, [hasStarted]);

  useEffect(() => {
    if (hasStarted) {
      const timer = setTimeout(() => {
        navigate('/browse');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, navigate]);

  useEffect(() => {
    const autoTimer = setTimeout(() => {
      triggerIntro(false);
    }, 4000);
    return () => clearTimeout(autoTimer);
  }, [triggerIntro]);

  useEffect(() => {
    const handler = () => triggerIntro(true);
    window.addEventListener('pointerdown', handler, { once: true });
    return () => window.removeEventListener('pointerdown', handler);
  }, [triggerIntro]);

  return (
    <div className="netflix-container" onClick={() => triggerIntro(true)}>
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
