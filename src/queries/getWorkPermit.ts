import { hasDatoCmsCredentials, requestDatoCMS } from './datoCMSClient';
import { WorkPermit } from '../types';

const GET_WORK_PERMIT = `
  query {
    workPermit {
      visaStatus
      expiryDate
      summary
      additionalInfo
    }
  }
`;

const FALLBACK_WORK_PERMIT: WorkPermit = {
  visaStatus: 'F-1 STEM OPT · Open to sponsorship',
  expiryDate: new Date('2027-06-01') as unknown as Date,
  summary:
    'Authorized to work in the United States under STEM OPT, focusing on AI/ML engineering engagements.',
  additionalInfo:
    'Available for full-time roles with immediate start; experienced collaborating across distributed engineering teams and global stakeholders.',
};

export async function getWorkPermit(): Promise<WorkPermit> {
  if (!hasDatoCmsCredentials) {
    return FALLBACK_WORK_PERMIT;
  }

  try {
    const data = await requestDatoCMS<{ workPermit: WorkPermit }>(GET_WORK_PERMIT);
    return data.workPermit ?? FALLBACK_WORK_PERMIT;
  } catch (error) {
    console.warn('Unable to load work permit from DatoCMS, using fallback.', error);
    return FALLBACK_WORK_PERMIT;
  }
}
