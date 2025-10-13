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
  visaStatus: 'F-1 STEM OPT (EAD pending) | Work authorization through Jan 1, 2029',
  expiryDate: new Date('2029-01-01') as unknown as Date,
  summary:
    'International student from India graduating in November and entering the STEM OPT window with the EAD card currently pending.',
  additionalInfo:
    'Maintains F-1 status through Jan 1, 2029 and can work full time on STEM OPT once the EAD is issued; open to long-term sponsorship conversations.',
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
