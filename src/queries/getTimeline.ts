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
    name: 'TekAnthem - Chicago, IL',
    title: 'Software Artificial Intelligence Engineer',
    techStack: 'Python | Flask | CrewAI | OpenAI | AWS | Kubernetes',
    summaryPoints: [
      'Built an end-to-end agentic testing platform that auto-generated and healed test suites with CrewAI agents, cutting manual validation effort by 60%.',
      'Used Gemini to translate UI screenshots into precise DOM structures with 90% accuracy for automated targeting.',
      'Connected Claude and FAISS to autogenerate Playwright and PyTest code from visual context, accelerating development by 70%.',
      'Deployed multimodal reporting on AWS containers, tripling inference throughput and improving reliability by 90%.',
      'Created real-time HTML test reports with OpenAI and LangChain to deliver instant feedback and faster debugging.',
    ],
    dateRange: 'Jul 2025 - Present',
  },
  {
    timelineType: 'work',
    name: 'DePaul University - Chicago, IL',
    title: 'Graduate Research Assistant (Deep Learning Theory Lab)',
    techStack: 'PyTorch | TensorFlow | Python | GPU Optimization',
    summaryPoints: [
      'Developed a tree-based hierarchical self-attention model that reduced Transformer memory to O(n) and computation to O(n log n).',
      'Optimized long-sequence NLP and forecasting pipelines with GPU acceleration, improving training speed by 15%.',
      'Designed ablation studies and evaluation benchmarks that increased model accuracy by 4% and interpretability.',
      'Collaborated weekly with faculty and peers on research reviews and code improvements, raising quality by 15%.',
    ],
    dateRange: 'Dec 2024 - Jun 2025',
  },
  {
    timelineType: 'work',
    name: 'Soulmi Health - Lombard, IL',
    title: 'Associate Generative AI Developer',
    techStack: 'Python | Mistral | spaCy | TypeScript | GCP',
    summaryPoints: [
      'Created an intelligent document automation system that processed more than 1,000 insurance mails daily, reducing manual review by 70%.',
      'Developed multimodal OCR pipelines to detect and redact sensitive content, achieving 90% compliance accuracy.',
      'Fine-tuned OpenAI models for claims categorization, reaching 90% accuracy with five times faster processing speed.',
      'Designed analytics dashboards on GCP with Oracle 19c integrations, cutting data access time by 90%.',
    ],
    dateRange: 'Jun 2024 - Jan 2025',
  },
  {
    timelineType: 'work',
    name: 'DePaul University - Remote',
    title: 'Grader (Machine Learning and Neural Networks, DSC 445)',
    techStack: 'Python | Scikit-learn | PyTorch | Jupyter',
    summaryPoints: [
      'Reviewed and graded more than 100 student projects covering model design, data preprocessing, and optimization best practices.',
      'Hosted mentoring sessions to explain regression, ensemble methods, CNNs, and backpropagation in approachable language.',
      'Provided structured feedback on experiments and reports that helped students improve model performance and clarity.',
      'Partnered with faculty to refine rubrics and streamline the grading workflow for consistent evaluation.',
    ],
    dateRange: 'Jan 2025 - Present',
  },
  {
    timelineType: 'education',
    name: 'DePaul University',
    title: 'Master of Science in Artificial Intelligence',
    techStack: 'Jan 2024 - Nov 2025 | Chicago, IL',
    summaryPoints: [],
    dateRange: '2024 - 2025',
  },
  {
    timelineType: 'education',
    name: 'MVJ College of Engineering',
    title: 'Bachelor of Engineering in Computer Science',
    techStack: 'Sep 2019 - Sep 2023 | Bengaluru, KA',
    summaryPoints: [],
    dateRange: '2019 - 2023',
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