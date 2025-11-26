import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopPicksRow.css';
import { FaPassport, FaCode, FaBriefcase, FaCertificate, FaHandsHelping, FaProjectDiagram, FaChevronLeft, FaChevronRight, FaFileAlt } from 'react-icons/fa';
import workPermitApproved from '../images/work-permit-approved.png';
import skillsSoftHard from '../images/skills-soft-hard.png';
import experienceImage from '../images/experience.png';
import certificationsImage from '../images/certifications.jpeg';
import recommendationsImage from '../images/recommendations.png';
import projectsImage from '../images/projects.png';
import publishImage from '../images/publish.png';

type ProfileType = 'recruiter' | 'developer' | 'stalker';

type TopPick = {
  title: string;
  imgSrc: string;
  route: string;
  icon?: React.ReactNode;
  imgStyle?: React.CSSProperties;
  cardClassName?: string;
};

interface TopPicksRowProps {
  profile: ProfileType;
}

const topPicksConfig: Record<ProfileType, TopPick[]> = {
  recruiter: [
    {
      title: "Work Permit",
      imgSrc: workPermitApproved,
      icon: <FaPassport />,
      route: "/work-permit",
      cardClassName: 'pick-card--warm',
      imgStyle: { objectPosition: 'center 42%' },
    },
    {
      title: "Skills",
      imgSrc: skillsSoftHard,
      icon: <FaCode />,
      route: "/skills",
      cardClassName: 'pick-card--neon',
      imgStyle: { objectPosition: 'center 54%' },
    },
    {
      title: "Experience",
      imgSrc: experienceImage,
      icon: <FaBriefcase />,
      route: "/work-experience",
      cardClassName: 'pick-card--experience',
      imgStyle: { objectPosition: 'center 45%' },
    },
    {
      title: "Certifications",
      imgSrc: certificationsImage,
      icon: <FaCertificate />,
      route: "/certifications",
      cardClassName: 'pick-card--certifications',
      imgStyle: { objectPosition: 'center 52%' },
    },
    {
      title: "Recommendations",
      imgSrc: recommendationsImage,
      icon: <FaHandsHelping />,
      route: "/recommendations",
      cardClassName: 'pick-card--recommendations',
      imgStyle: { objectPosition: 'center 48%' },
    },
    {
      title: "Projects",
      imgSrc: projectsImage,
      icon: <FaProjectDiagram />,
      route: "/projects",
      cardClassName: 'pick-card--projects',
      imgStyle: { objectPosition: 'center 55%' },
    },
    {
      title: "Publications",
      imgSrc: publishImage,
      icon: <FaFileAlt />,
      route: "/publications",
      cardClassName: 'pick-card--publications',
      imgStyle: { objectPosition: 'center 50%' },
    }
  ],
  developer: [
    {
      title: "Skills",
      imgSrc: skillsSoftHard,
      route: "/skills",
      icon: <FaCode />,
      cardClassName: 'pick-card--neon',
      imgStyle: { objectPosition: 'center 54%' },
    },
    {
      title: "Projects",
      imgSrc: projectsImage,
      route: "/projects",
      icon: <FaProjectDiagram />,
      cardClassName: 'pick-card--projects',
      imgStyle: { objectPosition: 'center 55%' },
    },
    {
      title: "Certifications",
      imgSrc: certificationsImage,
      route: "/certifications",
      icon: <FaCertificate />,
      cardClassName: 'pick-card--certifications',
      imgStyle: { objectPosition: 'center 52%' },
    },
    {
      title: "Experience",
      imgSrc: experienceImage,
      route: "/work-experience",
      icon: <FaBriefcase />,
      cardClassName: 'pick-card--experience',
      imgStyle: { objectPosition: 'center 45%' },
    },
    {
      title: "Recommendations",
      imgSrc: recommendationsImage,
      route: "/recommendations",
      icon: <FaHandsHelping />,
      cardClassName: 'pick-card--recommendations',
      imgStyle: { objectPosition: 'center 48%' },
    },
    {
      title: "Publications",
      imgSrc: publishImage,
      icon: <FaFileAlt />,
      route: "/publications",
      cardClassName: 'pick-card--publications',
      imgStyle: { objectPosition: 'center 50%' },
    }
  ],
  stalker: [
    {
      title: "Recommendations",
      imgSrc: recommendationsImage,
      route: "/recommendations",
      icon: <FaHandsHelping />,
      cardClassName: 'pick-card--recommendations',
      imgStyle: { objectPosition: 'center 48%' },
    },
    {
      title: "Projects",
      imgSrc: projectsImage,
      route: "/projects",
      icon: <FaProjectDiagram />,
      cardClassName: 'pick-card--projects',
      imgStyle: { objectPosition: 'center 55%' },
    },
    {
      title: "Experience",
      imgSrc: experienceImage,
      route: "/work-experience",
      icon: <FaBriefcase />,
      cardClassName: 'pick-card--experience',
      imgStyle: { objectPosition: 'center 45%' },
    },
    {
      title: "Certifications",
      imgSrc: certificationsImage,
      route: "/certifications",
      icon: <FaCertificate />,
      cardClassName: 'pick-card--certifications',
      imgStyle: { objectPosition: 'center 52%' },
    },
    {
      title: "Publications",
      imgSrc: publishImage,
      icon: <FaFileAlt />,
      route: "/publications",
      cardClassName: 'pick-card--publications',
      imgStyle: { objectPosition: 'center 50%' },
    }
  ],
};


const TopPicksRow: React.FC<TopPicksRowProps> = ({ profile }) => {
  const navigate = useNavigate();
  const topPicks = topPicksConfig[profile];
  const rowRef = useRef<HTMLDivElement | null>(null);

  const scrollRow = (direction: 'left' | 'right') => {
    const node = rowRef.current;
    if (!node) return;
    const amount = direction === 'left' ? -360 : 360;
    node.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="top-picks-row">
      <h2 className="row-title">Today's Top Picks for {profile}</h2>
      <div className="card-row-wrapper">
        <button
          type="button"
          className="card-nav card-nav--left"
          aria-label="Scroll picks left"
          onClick={() => scrollRow('left')}
        >
          <FaChevronLeft />
        </button>
        <div className="card-row" ref={rowRef}>
      {topPicks.map((pick, index) => (
          <div 
            key={index} 
            className={`pick-card ${pick.cardClassName ?? ''}`}
            onClick={() => navigate(pick.route)}
            style={{ animationDelay: `${index * 0.2}s` }} // Adding delay based on index
          >
            <img
              src={pick.imgSrc}
              alt={pick.title}
              className="pick-image"
              style={pick.imgStyle}
            />
            <div className="overlay">
              <div className="pick-label">{pick.title}</div>
            </div>
          </div>
        ))}
        </div>
        <button
          type="button"
          className="card-nav card-nav--right"
          aria-label="Scroll picks right"
          onClick={() => scrollRow('right')}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TopPicksRow;
