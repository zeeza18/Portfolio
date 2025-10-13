import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkPermit.css';
import { getWorkPermit } from '../queries/getWorkPermit';
import { WorkPermit as IWorkPermit } from '../types';
import workPermitApproved from '../images/work-permit-approved.png';

const WorkPermit: React.FC = () => {
  const [workPermitData, setWorkPermitData] = useState<IWorkPermit | null>(null);
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const closeWorkPermit = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchWorkPermitData() {
      const data = await getWorkPermit();
      setWorkPermitData(data);
    }
    fetchWorkPermitData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeWorkPermit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeWorkPermit]);

  const handleBackdropPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as Node | null;
    if (cardRef.current && target && !cardRef.current.contains(target)) {
      closeWorkPermit();
    }
  };

  if (!workPermitData) return <div>Loading...</div>;

  return (
    <div
      className="work-permit-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-permit-title"
      onPointerDown={handleBackdropPointerDown}
    >
      <div className="work-permit-card" ref={cardRef}>
        <div className="work-permit-media">
          <img
            src={workPermitApproved}
            alt="Work permit approved stamp"
            className="work-permit-image"
          />
        </div>
        <div className="work-permit-content">
          <h2 className="work-permit-headline" id="work-permit-title">
            Work Authorization
          </h2>
          <p className="work-permit-summary">
            {workPermitData.summary}{' '}
            <span className="work-permit-visa">
              Current status: <strong>{workPermitData.visaStatus}</strong>
            </span>
          </p>
          <p className="work-permit-expiry">
            Authorization valid through{' '}
            <strong>{new Date(workPermitData.expiryDate).toLocaleDateString()}</strong>.
          </p>
          <p className="additional-info">{workPermitData.additionalInfo}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkPermit;
