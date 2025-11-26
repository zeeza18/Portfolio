import React from 'react';
import './Publishes.css';
import { FaExternalLinkAlt, FaCode } from 'react-icons/fa';
import publicationImage from '../images/PUBLICATIONS_HEADER.png';

const Publishes: React.FC = () => {
  const publications = [
    {
      title: "Skin Disease Diagnosis Using VGG19 Algorithm and Treatment Recommendation System",
      link: "/papers/Research Paper Final.pdf",
      image: publicationImage,
      techStack: [
        "Python",
        "TensorFlow + Keras",
        "VGG19 Transfer Learning",
        "CNN Image Analysis",
        "Flask",
        "Docker",
      ],
      description:
        "Built a computer vision system that classifies 12+ skin conditions with VGG19 transfer learning and surfaces treatment recommendations. Compared against ResNet baselines, achieving 90%+ train and 85%+ validation accuracy on a curated dermatology dataset, and shipped as a Flask web app containerized with Docker for global access.",
      metrics: [
        { label: "Train Accuracy", value: "90%+" },
        { label: "Validation Accuracy", value: "85%+" },
        { label: "Classes Covered", value: "12+" },
        { label: "Deployment", value: "Flask + Docker" },
      ],
      publishedDate: "IEEE 2023 Conference",
      doi: "10.1109/I2CT57861.2023.10126212",
      conference: "2023 IEEE 8th International Conference for Convergence in Technology (I2CT), Lonavla, India",
    },
  ];

  return (
    <div className="publications-container">
      <header className="publications-header">
        <p className="eyebrow">Research Spotlight</p>
        <h1>Publications & Research</h1>
        <p>
          Computer vision research focused on dermatology diagnostics, pairing deep learning rigor with
          deployable systems thinking.
        </p>
      </header>

      <div className="publications-list">
        {publications.map((pub, index) => (
          <div
            key={pub.title}
            className="publication-card"
            style={{ '--delay': `${index * 0.15}s` } as React.CSSProperties}
          >
            <div className="publication-image">
              <img src={pub.image} alt={pub.title} />
            </div>

            <div className="publication-content">
              <h2>{pub.title}</h2>
              <p className="publication-description">{pub.description}</p>

              {pub.metrics && (
                <div className="publication-metrics">
                  {pub.metrics.map((metric) => (
                    <div key={metric.label} className="metric-chip">
                      <span className="metric-label">{metric.label}</span>
                      <span className="metric-value">{metric.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="publication-tech">
                {pub.techStack.map((tech) => (
                  <span key={tech} className="tech-badge">
                    <FaCode /> {tech}
                  </span>
                ))}
              </div>

              <div className="publication-footer">
                <span className="publication-date">Published {pub.publishedDate}</span>
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="publication-button"
                >
                  <FaExternalLinkAlt /> View Paper
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Publishes;
