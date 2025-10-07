import { hasDatoCmsCredentials, requestDatoCMS } from './datoCMSClient';
import { TimelineItem } from '../types';

const GET_TIMELINE = `
{
  allTimelines {
    name
    timelineType
    title
    techStack
    summaryPoints
    dateRange
  }
}
`;

const FALLBACK_TIMELINE: TimelineItem[] = [
  {
    timelineType: 'work',
    name: 'TekAnthem · Chicago, IL',
    title: 'Software Artificial Intelligence Engineer',
    techStack: 'Python · Flask · CrewAI · OpenAI · AWS · Kubernetes',
    summaryPoints: [
      'Designed agentic QA platforms that automated multi-step validation, cutting manual testing by 60%.',
      'Shipped Gemini-powered UI understanding delivering 90% accurate JSON for analytics pipelines.',
      'Built Claude + FAISS workflows to autogenerate Playwright/PyTest suites, improving incident recovery by 70%.',
      'Scaled multimodal reporting on AWS containers, tripling inference throughput and boosting reliability 90%.',
    ],
    dateRange: 'Jul 2025 – Present',
  },
  {
    timelineType: 'work',
    name: 'DePaul University · Chicago, IL',
    title: 'Graduate Research Assistant',
    techStack: 'TensorFlow · PyTorch · Scikit-learn · Data Pipelines',
    summaryPoints: [
      'Implemented hierarchical self-attention to improve LLM memory efficiency from O(n²) to O(n log n).',
      'Built reproducible regression/classification pipelines improving accuracy 12% and training speed 1.5×.',
      'Led ablation studies across CNN/RNN/Transformer models to deliver transparent benchmarking.',
    ],
    dateRange: 'Jan 2025 – Jun 2025',
  },
  {
    timelineType: 'work',
    name: 'Soulmi Health · Lombard, IL',
    title: 'Associate Generative AI Developer',
    techStack: 'Python · Mistral · spaCy · TypeScript · GCP',
    summaryPoints: [
      'Automated daily processing of 1K+ insurance documents, cutting manual review effort by 70%.',
      'Developed HIPAA-compliant multimodal OCR pipelines removing 90% sensitive content.',
      'Fine-tuned GPT models for mail categorization, reaching 90% accuracy with 5× throughput.',
    ],
    dateRange: 'Jun 2024 – Jan 2025',
  },
  {
    timelineType: 'education',
    name: 'DePaul University',
    title: 'M.S. Artificial Intelligence',
    techStack: 'Focus: LLMs · Distributed Systems · Responsible AI',
    summaryPoints: ['Jan 2024 – Nov 2025 · Chicago, IL'],
    dateRange: '2024 – 2025',
  },
  {
    timelineType: 'education',
    name: 'MVJ College of Engineering',
    title: 'B.E. Computer Science Engineering',
    techStack: 'Focus: Algorithms · Systems Programming · Software Engineering',
    summaryPoints: ['Sep 2019 – Sep 2023 · Bengaluru, KA'],
    dateRange: '2019 – 2023',
  },
];

export async function getTimeline(): Promise<TimelineItem[]> {
  if (!hasDatoCmsCredentials) {
    return FALLBACK_TIMELINE;
  }

  try {
    const data = await requestDatoCMS<{ allTimelines: TimelineItem[] }>(GET_TIMELINE);
    return data.allTimelines ?? FALLBACK_TIMELINE;
  } catch (error) {
    console.warn('Unable to load timeline from DatoCMS, using fallback.', error);
    return FALLBACK_TIMELINE;
  }
}
