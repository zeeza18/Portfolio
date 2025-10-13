import React from 'react';
import { Link } from 'react-router-dom';
import './ContinueWatching.css';
import musicImage from '../images/ac-dc.jpg';
import readingImage from '../images/alchemist.jpg';
import blogsImage from '../images/myalphadojo.png';
import contactImage from '../images/contact-me.png';
import certificationsImage from '../images/certifications.jpeg';

type ProfileType = 'recruiter' | 'developer' | 'stalker';

interface ContinueWatchingProps {
  profile: ProfileType;
}

type ContinueWatchingItem = { title: string; imgSrc: string; link: string };

const continueWatchingConfig: Record<ProfileType, ContinueWatchingItem[]> = {
  recruiter: [
    { title: "Music", imgSrc: musicImage, link: "/music" },
    { title: "Reading", imgSrc: readingImage, link: "/reading" },
    { title: "Blogs", imgSrc: blogsImage, link: "/blogs" },
    { title: "Contact Me", imgSrc: contactImage, link: "/contact-me" }
  ],
  developer: [
    { title: "Music", imgSrc: musicImage, link: "/music" },
    { title: "Reading", imgSrc: readingImage, link: "/reading" },
    { title: "Blogs", imgSrc: blogsImage, link: "/blogs" },
    { title: "Certifications", imgSrc: certificationsImage, link: "/certifications" },
    { title: "Contact Me", imgSrc: contactImage, link: "/contact-me" }
  ],
  stalker: [
    { title: "Reading", imgSrc: readingImage, link: "/reading" },
    { title: "Blogs", imgSrc: blogsImage, link: "/blogs" },
    { title: "Contact Me", imgSrc: contactImage, link: "/contact-me" }
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
            <img src={pick.imgSrc} alt={pick.title} className="pick-image" />
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
