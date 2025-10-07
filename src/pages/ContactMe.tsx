import React, { useEffect, useState } from 'react';
import './ContactMe.css';
import { FaEnvelope, FaPhoneAlt, FaCoffee, FaLinkedin } from 'react-icons/fa';
import { ContactMe as IContactMe } from '../types';
import { getContactMe } from '../queries/getContactMe';

const ContactMe: React.FC = () => {
  const [userData, setUserData] = useState<IContactMe>();

  useEffect(() => {
    async function fetchUserData() {
      const data = await getContactMe();
      setUserData(data);
    }

    fetchUserData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  const fallbackAvatar =
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=640&q=80';
  const avatarSrc = userData.profilePicture?.url || fallbackAvatar;

  return (
    <div className="contact-container">
      <div className="linkedin-badge-custom">
        <img src={avatarSrc} alt={userData.name} className="badge-avatar" />
        <div className="badge-content">
          <h3 className="badge-name">{userData.name}</h3>
          <p className="badge-title">{userData.title}</p>
          <p className="badge-description">{userData.summary}</p>
          <p className="badge-company">{userData.companyUniversity}</p>
          <a href={userData.linkedinLink} target="_blank" rel="noopener noreferrer" className="badge-link">
            <FaLinkedin className="linkedin-icon" /> View Profile
          </a>
        </div>
      </div>

      <div className="contact-header">
        <p>Ready to collaborate on the next intelligent system? Drop a note or schedule time.</p>
      </div>

      <div className="contact-details">
        <div className="contact-item">
          <FaEnvelope className="contact-icon" />
          <a href={`mailto:${userData.email}`} className="contact-link">
            {userData.email}
          </a>
        </div>
        <div className="contact-item">
          <FaPhoneAlt className="contact-icon" />
          <a href={`tel:${userData.phoneNumber}`} className="contact-link">
            {userData.phoneNumber}
          </a>
        </div>
      </div>

      <div className="contact-fun">
        Let&apos;s share ideas over coffee or a whiteboard session.
        <FaCoffee className="coffee-icon" />
      </div>
    </div>
  );
};

export default ContactMe;
