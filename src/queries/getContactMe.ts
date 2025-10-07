import { hasDatoCmsCredentials, requestDatoCMS } from './datoCMSClient';
import { ContactMe } from '../types';

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
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=640&q=80',
  },
  name: 'Mohammed Azeezulla',
  title: 'AI/ML Engineer',
  summary:
    'Designing agentic automation, multimodal analytics, and production-ready ML platforms that unlock measurable business impact.',
  companyUniversity: 'TekAnthem · Chicago, IL',
  linkedinLink: 'https://www.linkedin.com/in/moazeez/',
  email: 'mmoha134@depaul.edu',
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
