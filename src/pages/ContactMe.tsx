import React, { useEffect, useState } from 'react';
import './ContactMe.css';
import { FaEnvelope, FaPhoneAlt, FaCoffee, FaLinkedin } from 'react-icons/fa';
import { ContactMe as IContactMe } from '../types';
import { getContactMe } from '../queries/getContactMe';
import defaultAvatar from '../images/me.png';

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

  const fallbackAvatar = defaultAvatar;
  const avatarSrc = userData.profilePicture?.url || fallbackAvatar;

  const emails = [userData.email, userData.secondaryEmail].filter(
    (value): value is string => Boolean(value)
  );

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
        <p>Ready to collaborate on the next intelligent system? Reach out by email or phone and we&apos;ll lock in time.</p>
      </div>

      <div className="contact-details">
        {emails.map((email) => (
          <div className="contact-item" key={email}>
            <FaEnvelope className="contact-icon" />
            <a href={`mailto:${email}`} className="contact-link">
              {email}
            </a>
          </div>
        ))}
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
