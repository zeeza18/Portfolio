import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopPicksRow.css';
import { FaPassport, FaCode, FaBriefcase, FaCertificate, FaHandsHelping, FaProjectDiagram, FaEnvelope } from 'react-icons/fa';
import workPermitApproved from '../images/work-permit-approved.png';
import skillsSoftHard from '../images/skills-soft-hard.png';
import experienceImage from '../images/experience.png';
import certificationsImage from '../images/certifications.jpeg';
import recommendationsImage from '../images/recommendations.png';
import projectsImage from '../images/projects.png';
import contactImage from '../images/contact-me.png';

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
      title: "Contact Me",
      imgSrc: contactImage,
      icon: <FaEnvelope />,
      route: "/contact-me",
      cardClassName: 'pick-card--contact',
      imgStyle: { objectPosition: 'center 42%' },
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
      title: "Contact Me",
      imgSrc: contactImage,
      route: "/contact-me",
      icon: <FaEnvelope />,
      cardClassName: 'pick-card--contact',
      imgStyle: { objectPosition: 'center 42%' },
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
      title: "Contact Me",
      imgSrc: contactImage,
      route: "/contact-me",
      icon: <FaEnvelope />,
      cardClassName: 'pick-card--contact',
      imgStyle: { objectPosition: 'center 42%' },
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
  ],
};


const TopPicksRow: React.FC<TopPicksRowProps> = ({ profile }) => {
  const navigate = useNavigate();
  const topPicks = topPicksConfig[profile];

  return (
    <div className="top-picks-row">
      <h2 className="row-title">Today's Top Picks for {profile}</h2>
      <div className="card-row">
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
    </div>
  );
};

export default TopPicksRow;
