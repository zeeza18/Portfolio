import { hasDatoCmsCredentials, requestDatoCMS } from './datoCMSClient';
import { Certification } from '../types';
import { CERTIFICATES } from '../data/certificates';

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

export async function getCertifications(): Promise<Certification[]> {
  if (!hasDatoCmsCredentials) {
    return CERTIFICATES;
  }

  try {
    const data = await requestDatoCMS<{ allCertifications: Certification[] }>(GET_CERTIFICATIONS);
    if (data.allCertifications && data.allCertifications.length > 0) {
      return data.allCertifications;
    }
    return CERTIFICATES;
  } catch (error) {
    console.warn('Unable to load certifications from DatoCMS, using fallback.', error);
    return CERTIFICATES;
  }
}
