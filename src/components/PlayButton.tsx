import React, { useCallback, useEffect, useRef } from 'react';
import './PlayButton.css';
import netflixSound from '../netflix-sound.mp3';

interface PlayButtonProps {
  onClick: () => void;
  label?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onClick, label = "Play" }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(netflixSound);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleClick = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.warn('Unable to play intro sound.', error);
      });
    }
    onClick();
  }, [onClick]);

  return (
    <button className="play-button" onClick={handleClick} type="button">
      <div className="icon-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="black"
          role="img"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
        >
          <path
            d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
            fill="black"
          />
        </svg>
      </div>
      <div className="spacer"></div>
      <span className="label">{label}</span>
    </button>
  );
};

export default PlayButton;
