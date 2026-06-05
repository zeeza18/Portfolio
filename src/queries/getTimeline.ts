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
    name: 'JPMorgan Chase & Co, USA',
    title: 'AI/ML Engineer',
    techStack: 'LlamaIndex | AutoGen | FAISS | Pinecone | AWS SageMaker | BentoML | Kubernetes | Docker | Terraform | MCP',
    summaryPoints: [
      'Developed and deployed Generative AI applications using LlamaIndex, improving retrieval precision by ~28% measured via automated evaluation benchmarks.',
      'Built RAG-based pipelines with FAISS and Pinecone to enhance contextual retrieval accuracy and reduce hallucination rates in production query responses.',
      'Architected multi-agent AI systems using AutoGen to automate document processing and data extraction workflows, reducing manual effort across operations teams.',
      'Deployed inference services using AWS SageMaker and BentoML, reducing average response latency from ~1.8s to ~1.3s through endpoint optimization and request batching.',
      'Designed end-to-end ML deployment pipelines using Kubernetes, Docker, and Terraform, enabling reproducible and scalable model releases.',
      'Established MCP pipelines to unify AI agents with enterprise applications and internal data repositories.',
    ],
    dateRange: 'Apr 2025 - Present',
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
    timelineType: 'work',
    name: 'HCLTech, India',
    title: 'AI Engineer',
    techStack: 'HuggingFace | Sentence Transformers | FAISS | Azure ML | CrewAI | LangGraph | Python',
    summaryPoints: [
      'Trained and fine-tuned HuggingFace transformer-based NLP models for text classification and named entity recognition, improving F1 score by ~18% over the BERT baseline.',
      'Built embedding-based semantic search pipelines using Sentence Transformers and FAISS, integrated into internal knowledge retrieval tools ahead of broader LLM adoption.',
      'Deployed NLP models on Azure ML with managed endpoints, enabling scalable real-time inference and automated performance monitoring.',
      'Developed agent-based automation workflows using CrewAI for document processing and support operations.',
      'Implemented LangGraph-based pipelines for stateful multi-step data extraction and workflow optimization.',
    ],
    dateRange: 'Jun 2022 - Nov 2023',
  },
  {
    timelineType: 'work',
    name: 'Tech Mahindra, India',
    title: 'ML Engineer',
    techStack: 'Python | Apache Spark | GCP Vertex AI | FastAPI | Scikit-learn',
    summaryPoints: [
      'Engineered supervised ML models for customer churn prediction, product classification, and collaborative filtering-based recommendation.',
      'Trained and deployed models on GCP AI Platform (now Vertex AI) using managed training jobs and hyperparameter tuning pipelines.',
      'Built data preprocessing and feature engineering workflows in Python and Apache Spark for large-scale structured datasets.',
      'Created FastAPI-based microservices to expose ML model predictions as REST endpoints consumed by internal business applications.',
    ],
    dateRange: 'Dec 2020 - May 2022',
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