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

          <div className="recommendation-modal-section">
            <p className="recommendation-modal-intro">
              Ready to collaborate on the next intelligent system? If you've worked with me and would like to share your experience, I'd greatly appreciate a recommendation.
            </p>
          </div>

          <div className="recommendation-modal-section">
            <h3>What I Bring</h3>
            <ul className="recommendation-modal-list">
              <li>Deep ML expertise paired with pragmatic engineering instincts</li>
              <li>Experience architecting agentic QA initiatives and automation platforms</li>
              <li>Ability to translate ambiguous requirements into reliable roadmaps</li>
              <li>Collaborative style with cross-functional teams (designers, QA, DevOps)</li>
              <li>Focus on tangible progress with clear documentation</li>
            </ul>
          </div>

          <div className="recommendation-modal-section">
            <h3>Recent Experience</h3>
            <p className="recommendation-modal-experience">
              Currently working on enterprise ML systems, building intelligent automation solutions with LangChain, CrewAI, and containerized inference. Proven track record of reducing incident recovery times by 70%+ through innovative QA automation.
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

          <p className="recommendation-modal-footer">
            Let's share ideas over coffee or a whiteboard session. Thank you for taking the time!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;
