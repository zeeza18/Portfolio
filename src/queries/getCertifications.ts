import { hasDatoCmsCredentials, requestDatoCMS } from './datoCMSClient';
import { Certification } from '../types';

const GET_CERTIFICATIONS = `
  query {
    allCertifications {
      title
      issuer
      issuedDate
      link
      iconName
    }
  }
`;

const FALLBACK_CERTIFICATIONS: Certification[] = [
  {
    title: 'AWS Certified Machine Learning – Specialty',
    issuer: 'Amazon Web Services',
    issuedDate: '2024',
    link: 'https://aws.amazon.com/certification/certified-machine-learning-specialty/',
    iconName: 'university',
  },
  {
    title: 'Generative AI with Large Language Models',
    issuer: 'Coursera · DeepLearning.AI',
    issuedDate: '2024',
    link: 'https://www.coursera.org/learn/generative-ai-with-llms',
    iconName: 'coursera',
  },
  {
    title: 'MLOps Fundamentals',
    issuer: 'Udemy',
    issuedDate: '2023',
    link: 'https://www.udemy.com/',
    iconName: 'udemy',
  },
];

export async function getCertifications(): Promise<Certification[]> {
  if (!hasDatoCmsCredentials) {
    return FALLBACK_CERTIFICATIONS;
  }

  try {
    const data = await requestDatoCMS<{ allCertifications: Certification[] }>(GET_CERTIFICATIONS);
    return data.allCertifications ?? FALLBACK_CERTIFICATIONS;
  } catch (error) {
    console.warn('Unable to load certifications from DatoCMS, using fallback.', error);
    return FALLBACK_CERTIFICATIONS;
  }
}
