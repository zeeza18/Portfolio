import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './ContinueWatching.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import lifeImage from '../images/social-life.png';
import readingImage from '../images/reading-paper.png';
import blogsImage from '../images/blog.png';
import contactImage from '../images/contact-me.png';

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
    { title: "Contact", imgSrc: contactImage, link: "/contact-me" }
  ],
  developer: [
    { title: "Social", imgSrc: lifeImage, link: "/social" },
    { title: "Reading", imgSrc: readingImage, link: "/reading" },
    { title: "Blogs", imgSrc: blogsImage, link: "/blogs" },
    { title: "Contact", imgSrc: contactImage, link: "/contact-me" }
  ],
  stalker: [
    { title: "Social", imgSrc: lifeImage, link: "/social" },
    { title: "Reading", imgSrc: readingImage, link: "/reading" },
    { title: "Blogs", imgSrc: blogsImage, link: "/blogs" },
    { title: "Contact", imgSrc: contactImage, link: "/contact-me" }
  ],
};

const ContinueWatching: React.FC<ContinueWatchingProps> = ({ profile }) => {
  const continueWatching = continueWatchingConfig[profile];
  const rowRef = useRef<HTMLDivElement | null>(null);

  const scrollRow = (direction: 'left' | 'right') => {
    const node = rowRef.current;
    if (!node) return;
    const amount = direction === 'left' ? -360 : 360;
    node.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="continue-watching-row">
      <h2 className="row-title">Continue Watching for {profile}</h2>
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

export default ContinueWatching;
