import { hasDatoCmsCredentials, requestDatoCMS } from './datoCMSClient';
import { ContactMe } from '../types';
import profileAvatar from '../images/me.png';

const GET_CONTACT_ME = `
  query {
    contactMe {
      profilePicture {
        url
      }
      name
      title
      summary
      companyUniversity
      linkedinLink
      email
      phoneNumber
    }
  }
`;

const FALLBACK_CONTACT: ContactMe = {
  profilePicture: {
    url: profileAvatar,
  },
  name: 'Mohammed Azeezulla',
  title: 'AI Engineer & Researcher',
  summary:
    'AI engineer and researcher focused on intelligent systems, agentic automation, and translating cutting-edge experimentation into production-ready AI capabilities.',
  companyUniversity: 'TekAnthem - Chicago, IL',
  linkedinLink: 'https://www.linkedin.com/in/moazeez/',
  email: 'azeezullamohammedam@gmail.com',
  secondaryEmail: 'mmoha134@depaul.edu',
  phoneNumber: '+1 (872) 330-2122',
};

export async function getContactMe(): Promise<ContactMe> {
  if (!hasDatoCmsCredentials) {
    return FALLBACK_CONTACT;
  }

  try {
    const data = await requestDatoCMS<{ contactMe: ContactMe }>(GET_CONTACT_ME);
    return data.contactMe ?? FALLBACK_CONTACT;
  } catch (error) {
    console.warn('Unable to load contact info from DatoCMS, using fallback.', error);
    return FALLBACK_CONTACT;
  }
}
