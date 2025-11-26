import React, { useEffect, useRef } from 'react';
import './RecommendationModal.css';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({ isOpen, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as Node | null;
    if (cardRef.current && target && !cardRef.current.contains(target)) {
      onClose();
    }
  };

  return (
    <div
      className="recommendation-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recommendation-modal-title"
      onPointerDown={handleBackdropPointerDown}
    >
      <div className="recommendation-modal" ref={cardRef}>
        <div className="recommendation-modal-content">
          <h2 className="recommendation-modal-title">Recommend Me</h2>

          <p className="recommendation-modal-intro">
            If you've worked with me and would like to share your experience, I'd greatly appreciate a recommendation.
          </p>

          <div className="recommendation-modal-highlights">
            <h3>What I Bring</h3>
            <p>
              Deep ML expertise with pragmatic engineering instincts. I architect intelligent automation platforms,
              translate ambiguous requirements into reliable roadmaps, and collaborate seamlessly with cross-functional
              teams to deliver tangible results with clear documentation.
            </p>
          </div>

          <div className="recommendation-modal-cta">
            <p>Your recommendation helps others understand my work and impact.</p>
            <a
              href="https://forms.gle/JyzMGifriQa3tbsd6"
              target="_blank"
              rel="noopener noreferrer"
              className="recommendation-modal-button"
            >
              <FaExternalLinkAlt /> Fill Recommendation Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;
