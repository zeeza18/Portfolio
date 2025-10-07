import { hasDatoCmsCredentials, requestDatoCMS } from './datoCMSClient';
import { Project } from '../types';

const GET_PROJECTS = `
  query {
    allProjects(orderBy: title_ASC) {
      title
      description
      techUsed
      image {
        url
      }
    }
  }
`;

const FALLBACK_PROJECTS: Project[] = [
  {
    title: 'Symptoms to Solution',
    description:
      'Healthcare AI platform that interprets 10K+ symptom records, applying severity-weighted features and ensemble modelling to recommend diagnoses with clear explainability.',
    techUsed: 'Python, Scikit-learn, Pandas, SVM, XGBoost',
    image: {
      url: 'https://images.unsplash.com/photo-1587502537685-11619fc0b429?auto=format&fit=crop&w=900&q=80',
    },
  },
  {
    title: 'Agentic QA Platform',
    description:
      'Multi-agent automation that orchestrates scenario planning, generative Playwright suites, and telemetry feedback loops to keep enterprise releases resilient.',
    techUsed: 'CrewAI, LangChain, Playwright, PyTest, AWS, Grafana',
    image: {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    },
  },
  {
    title: 'Compliance OCR Engine',
    description:
      'HIPAA-compliant OCR stack that redacts sensitive data, enriches metadata, and powers secure retrieval for insurance operations.',
    techUsed: 'Python, Mistral, spaCy, Vertex AI, Docker, Kubernetes',
    image: {
      url: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80',
    },
  },
];

export async function getProjects(): Promise<Project[]> {
  if (!hasDatoCmsCredentials) {
    return FALLBACK_PROJECTS;
  }

  try {
    const data = await requestDatoCMS<{ allProjects: Project[] }>(GET_PROJECTS);
    return data.allProjects ?? FALLBACK_PROJECTS;
  } catch (error) {
    console.warn('Unable to load projects from DatoCMS, using fallback.', error);
    return FALLBACK_PROJECTS;
  }
}
