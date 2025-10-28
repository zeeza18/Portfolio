import React from 'react';
import { Link } from 'react-router-dom';
import './ContinueWatching.css';
import lifeImage from '../images/social-life.png';
import readingImage from '../images/reading-paper.png';
import blogsImage from '../images/blog.png';
import contactImage from '../images/contact-me.png';
import certificationsImage from '../images/certifications.jpeg';

type ProfileType = 'recruiter' | 'developer' | 'stalker';

interface ContinueWatchingProps {
  profile: ProfileType;
}

type ContinueWatchingItem = { title: string; link: string; imgSrc?: string };

const continueWatchingConfig: Record<ProfileType, ContinueWatchingItem[]> = {
  recruiter: [
    { title: "Social", imgSrc: lifeImage, link: "/social" },
    { title: "Reading", imgSrc: readingImage, link: "/reading" },
    { title: "Blogs", imgSrc: blogsImage, link: "/blogs" },
    { title: "Contact Me", imgSrc: contactImage, link: "/contact-me" }
  ],
  developer: [
    { title: "Social", imgSrc: lifeImage, link: "/social" },
    { title: "Reading", imgSrc: readingImage, link: "/reading" },
    { title: "Blogs", imgSrc: blogsImage, link: "/blogs" },
    { title: "Certifications", imgSrc: certificationsImage, link: "/certifications" },
    { title: "Contact Me", imgSrc: contactImage, link: "/contact-me" }
  ],
  stalker: [
    { title: "Social", imgSrc: lifeImage, link: "/social" },
    { title: "Reading", imgSrc: readingImage, link: "/reading" },
    { title: "Blogs", imgSrc: blogsImage, link: "/blogs" }
  ],
};

const ContinueWatching: React.FC<ContinueWatchingProps> = ({ profile }) => {
  const continueWatching = continueWatchingConfig[profile];

  return (
    <div className="continue-watching-row">
      <h2 className="row-title">Continue Watching for {profile}</h2>
      <div className="card-row">
        {continueWatching.map((pick, index) => (
          <Link to={pick.link} key={index} className="pick-card">
            {pick.imgSrc ? (
              <img src={pick.imgSrc} alt={pick.title} className="pick-image" />
            ) : (
              <div className="pick-image placeholder">
                <span>{pick.title}</span>
              </div>
            )}
            <div className="overlay">
              <div className="pick-label">{pick.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;
