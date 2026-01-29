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
    name: 'State Street, USA',
    title: 'AI Engineer',
    techStack: 'OpenAI | LangChain | Hugging Face | MLOps | RAG | Docker',
    summaryPoints: [
      'Architected a GenAI investment intelligence solution using OpenAI large language models and retrieval-augmented reasoning, reducing manual portfolio risk analysis effort by 45% for investment teams.',
      'Constructed a semantic retrieval layer with LangChain and vector-based search to unify trades, benchmarks, and regulations, improving natural language portfolio insight accuracy by 38%.',
      'Specialized finance-aware transformer models using Hugging Face architectures to strengthen investment terminology understanding, decreasing incorrect financial explanations by 30% during volatile market review cycles.',
      'Operationalized scalable GenAI inference through containerized deployment and governed MLOps orchestration, enabling secure fintech AI usage and increasing analytics platform adoption by 28%.',
      'Synthesized pricing signals, liquidity metrics, and performance drivers into RAG-based investment narratives, improving portfolio explanation clarity by 40% and reducing reporting preparation effort by 35%.',
    ],
    dateRange: 'Oct 2025 - Present',
  },
  {
    timelineType: 'work',
    name: 'TekAnthem, USA',
    title: 'Artificial Intelligence Engineer (Remote)',
    techStack: 'CrewAI | Python | Claude | Azure | OpenAI | LangChain | Playwright',
    summaryPoints: [
      'Engineered an Agentic AI testing workflow using CrewAI and Python to replace unreliable manual validation, refine LLM prompt behavior, automate multi-agent evaluations, and elevate testing efficiency by nearly 60%.',
      'Devised a structured-extraction pipeline using representation learning and Azure services to handle inconsistent UI layouts, design JSON-based output mapping, generate reusable backend objects, and achieve nearly 90% accuracy.',
      'Coordinated Claude-driven automation with Playwright and PyTest to strengthen fragile test flows, introduce retrieval-augmented prompts, embed redundancy logic, and improve test-recovery performance by around 70%.',
      'Constructed multimodal evaluation dashboards with OpenAI, LangChain, and embedding-based scoring to overcome inconsistent model reviews, formalize validation workflows, standardize AI safety checks, and increase stakeholder adoption to roughly 90%.',
      'Advanced the AI quality-assurance lifecycle by integrating Gemini, vector stores, and LLM-based inspectors to fix inconsistent monitoring, enforce unified scoring metrics, automate research validation, and accelerate deployment cycles by nearly 40%.',
    ],
    dateRange: 'Jun 2025 - Sep 2025',
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
    timelineType: 'work',
    name: 'Streebo Inc, India',
    title: 'Machine Learning Engineer',
    techStack: 'LightGBM | TensorFlow | Spark | Kafka | AWS | Docker | Kubernetes',
    summaryPoints: [
      'Engineered a financial risk intelligence pipeline by unifying borrower histories, bureau files, salary documents, and payment streams, and optimized feature extraction using Spark, SQL, credit-bureau APIs, AML/KYC modules, and OCR parsers, boosting credit-risk readiness by over 42% and improving stability assessment through refined Power BI insights.',
      'Formulated advanced credit-default and fraud-likelihood models with LightGBM, Scikit-Learn, and TensorFlow while aligning model architecture with loan decision workflows and orchestrated retraining, bias checks, and MLflow versioning which elevated scoring precision by over 31% and supported loan officers with SHAP-driven financial explainability.',
      'Integrated Kafka streaming with Spark, Redis, AWS services, and fraud-scoring/AML monitoring feeds to detect transaction velocity shifts, merchant anomalies, and geo-behavior outliers, and refined Autoencoder-based anomaly logic across compliance checkpoints, boosting fraud-capture consistency by over 37% and improving analyst case reviews in Tableau.',
      'Directed Airflow-based scoring cycles and SageMaker deployments by standardizing batch and streaming inference paths for risk and fraud modules and optimized orchestration and alert delivery using Elasticsearch insights which reduced manual intervention for financial risk units by over 40% through stable automation and rapid scoring turnaround.',
      'Executed unified microservice deployments across Docker and Kubernetes while embedding regulatory checkpoints into finance workflows and synthesized model interpretability, account-level traceability, and transaction-level audit trails which improved analytic reliability by over 29% and positioned the platform to support secure lending operations and scalable payment monitoring.',
    ],
    dateRange: 'Sep 2021 - Dec 2023',
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