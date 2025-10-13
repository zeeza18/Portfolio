import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './ProfilePage.css';

import ProfileBanner from './ProfileBanner';
import TopPicksRow from './TopPicksRow';
import ContinueWatching from './ContinueWatching';

type ProfileType = 'recruiter' | 'developer' | 'stalker';

const validProfiles: ProfileType[] = ['recruiter', 'developer', 'stalker'];

const ProfilePage: React.FC = () => {
  const location = useLocation();
  const backgroundGif =
    location.state?.backgroundGif ||
    'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif';
  const { profileName } = useParams<{ profileName: string }>();

  const profile = (validProfiles as string[]).includes(profileName ?? '')
    ? (profileName as ProfileType)
    : 'recruiter';

  return (
    <>
      <div className="profile-page" style={{ backgroundImage: `url(${backgroundGif})` }}>
        <ProfileBanner />
      </div>
      <TopPicksRow profile={profile} />
      <ContinueWatching profile={profile} />
    </>
  );
};

export default ProfilePage;
