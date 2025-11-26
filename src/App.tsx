import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NetflixTitle from './NetflixTitle';
import ProfilePage from './profilePage/profilePage';
import Browse from './browse/browse';
import WorkPermit from './pages/WorkPermit';
import WorkExperience from './pages/WorkExperience';
import Recommendations from './pages/Recommendations';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import ContactMe from './pages/ContactMe';
import Layout from './Layout';
import Social from './pages/Social';
import Reading from './pages/Reading';
import Blogs from './pages/Blogs';
import Certifications from './pages/Certifications';
import Transformer from './pages/Transformer';
import ZeezaPost from './pages/ZeezaPost';
import Publishes from './pages/Publishes';

const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<NetflixTitle autoStart={Boolean(location.state?.autoStartIntro)} />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/profile/:profileName" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/work-permit" element={<Layout><WorkPermit /></Layout>} />
      <Route path="/work-experience" element={<Layout><WorkExperience /></Layout>} />
      <Route path="/recommendations" element={<Layout><Recommendations /></Layout>} />
      <Route path="/skills" element={<Layout><Skills /></Layout>} />
      <Route path="/projects" element={<Layout><Projects /></Layout>} />
      <Route path="/contact-me" element={<Layout><ContactMe /></Layout>} />
      <Route path="/social" element={<Layout><Social /></Layout>} />
      <Route path="/reading" element={<Layout><Reading /></Layout>} />
      <Route path="/blogs" element={<Layout><Blogs /></Layout>} />
      <Route path="/blogs/transformer" element={<Layout><Transformer /></Layout>} />
      <Route path="/certifications" element={<Layout><Certifications /></Layout>} />
      <Route path="/publications" element={<Layout><Publishes /></Layout>} />
      <Route path="/zeeza_post" element={<ZeezaPost />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return <AppRoutes />;
};

export default App;
