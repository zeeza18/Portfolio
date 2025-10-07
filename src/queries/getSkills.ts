import { hasDatoCmsCredentials, requestDatoCMS } from './datoCMSClient';
import { Skill } from '../types';

const GET_SKILLS = `
{
  allSkills(orderBy: category_ASC) {
    name
    category
    description
    icon
  }
}
`;

const FALLBACK_SKILLS: Skill[] = [
  {
    name: 'Python & PyTorch',
    category: 'AI/ML Engineering',
    description: 'Designing agentic workflows, multimodal experimentation, and production ML services.',
    icon: 'FaPython',
  },
  {
    name: 'LangChain & CrewAI',
    category: 'AI/ML Engineering',
    description: 'Building retrieval-augmented agents and evaluation harnesses for enterprise automation.',
    icon: 'SiImessage',
  },
  {
    name: 'OpenAI · Claude · Gemini',
    category: 'AI/ML Engineering',
    description: 'Prompt engineering, supervised fine-tuning, and guardrails for multimodal deployments.',
    icon: 'FaReact',
  },
  {
    name: 'AWS · Azure · GCP',
    category: 'Cloud & DevOps',
    description: 'Architecting resilient deployments, observability pipelines, and scalable inference stacks.',
    icon: 'FaAws',
  },
  {
    name: 'Kubernetes & Docker',
    category: 'Cloud & DevOps',
    description: 'Container orchestration, autoscaling, and GitOps workflows for ML services.',
    icon: 'SiKubernetes',
  },
  {
    name: 'CI/CD & GitOps',
    category: 'Cloud & DevOps',
    description: 'Automating delivery with GitHub Actions, ArgoCD, and reproducible infrastructure.',
    icon: 'FaGitAlt',
  },
  {
    name: 'Spring Boot & Java',
    category: 'Software Engineering',
    description: 'Microservices, API design, and integration patterns for enterprise platforms.',
    icon: 'SiSpringboot',
  },
  {
    name: 'Ruby on Rails',
    category: 'Software Engineering',
    description: 'Rapid prototyping, RESTful services, and domain-driven product iterations.',
    icon: 'SiRubyonrails',
  },
  {
    name: 'TypeScript & React',
    category: 'Software Engineering',
    description: 'Building interactive dashboards, design systems, and analytics frontends.',
    icon: 'SiTypescript',
  },
  {
    name: 'PostgreSQL & MongoDB',
    category: 'Data Platforms',
    description: 'Schema design, query optimization, and hybrid transactional/analytics workloads.',
    icon: 'SiPostgresql',
  },
  {
    name: 'Vertex AI & BigQuery',
    category: 'Data Platforms',
    description: 'Managed ML operations, feature stores, and governed analytics pipelines.',
    icon: 'SiGooglecloud',
  },
];

export async function getSkills(): Promise<Skill[]> {
  if (!hasDatoCmsCredentials) {
    return FALLBACK_SKILLS;
  }

  try {
    const data = await requestDatoCMS<{ allSkills: Skill[] }>(GET_SKILLS);
    return data.allSkills ?? FALLBACK_SKILLS;
  } catch (error) {
    console.warn('Unable to load skills from DatoCMS, using fallback.', error);
    return FALLBACK_SKILLS;
  }
}
