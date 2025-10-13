import { hasDatoCmsCredentials, requestDatoCMS } from './datoCMSClient';
import { ProfileBanner } from '../types';

const GET_PROFILE_BANNER = `
 {
  profilebanner {
    backgroundImage {
      url
    }
    headline
    resumeLink {
      url
    }
    linkedinLink
    profileSummary
  }
}
`;

const FALLBACK_PROFILE_BANNER: ProfileBanner = {
  backgroundImage: {
    url: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
  },
  headline: 'Mohammed Azeezulla | AI Engineer & Researcher',
  resumeLink: {
    url: '/resume.pdf',
  },
  linkedinLink: 'https://www.linkedin.com/in/moazeez/',
  profileSummary:
    'AI engineer and researcher building agentic automation, multimodal analytics, and resilient platforms that turn complex operations into intelligent, reliable systems.',
};

export async function getProfileBanner(): Promise<ProfileBanner> {
  if (!hasDatoCmsCredentials) {
    return FALLBACK_PROFILE_BANNER;
  }

  try {
    const data = await requestDatoCMS<{ profilebanner: ProfileBanner }>(GET_PROFILE_BANNER);
    return data.profilebanner ?? FALLBACK_PROFILE_BANNER;
  } catch (error) {
    console.warn('Unable to load profile banner from DatoCMS, using fallback.', error);
    return FALLBACK_PROFILE_BANNER;
  }
}
