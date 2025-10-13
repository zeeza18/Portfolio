import React, { useEffect, useMemo, useState } from 'react';
import './Certifications.css';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Certification } from '../types';
import { getCertifications } from '../queries/getCertifications';

const Certifications: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    async function fetchCertifications() {
      const data = await getCertifications();
      setCertifications(data);
    }

    fetchCertifications();
  }, []);

  const cards = useMemo(() => {
    return certifications.map((cert) => {
      const format = cert.format ?? (cert.link.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image');
      const hasImagePreview = !!cert.imageUrl && format === 'image';

      return {
        ...cert,
        format,
        hasImagePreview,
      };
    });
  }, [certifications]);

  if (cards.length === 0) {
    return <div className="certifications-loading">Loading certificates…</div>;
  }

  return (
    <div className="certifications-container">
      <header className="certifications-header">
        <h1>Certificates & Recognition</h1>
        <p>
          A curated set of learning paths, hackathons, and internships spanning Generative AI, data science, engineering, and
          community leadership.
        </p>
      </header>

      <div className="certifications-grid">
        {cards.map((cert, index) => (
          <a
            href={cert.link}
            key={cert.title}
            target="_blank"
            rel="noopener noreferrer"
            className="certification-card"
            style={{ '--delay': `${index * 0.15}s` } as React.CSSProperties}
          >
            <div className="certification-media" aria-hidden="true">
              {cert.hasImagePreview ? (
                <img src={cert.imageUrl} alt="" loading="lazy" />
              ) : cert.format === 'pdf' ? (
                <object
                  data={`${cert.link}#toolbar=0&navpanes=0&scrollbar=0`}
                  type="application/pdf"
                >
                  <div className="certification-media-fallback">PDF preview unavailable</div>
                </object>
              ) : (
                <div className="certification-media-fallback">Preview unavailable</div>
              )}
              <span className="certification-media-badge">
                <FaExternalLinkAlt aria-hidden="true" />
                <span>Open</span>
              </span>
            </div>

            <div className="certification-content">
              {cert.topics && cert.topics.length > 0 && (
                <div className="certification-topics">
                  {cert.topics.map((topic) => (
                    <span className="certification-topic" key={`${cert.title}-${topic}`}>
                      {topic}
                    </span>
                  ))}
                </div>
              )}
              <h3>{cert.title}</h3>
              <p className="certification-issuer">{cert.issuer}</p>
              {cert.summary && <p className="certification-summary">{cert.summary}</p>}
              {cert.issuedDate && <span className="issued-date">Issued {cert.issuedDate}</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Certifications;
