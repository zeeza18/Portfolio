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
    name: 'HTML',
    category: 'Technical Skills',
    description: 'Semantic markup for responsive, accessible front-ends.',
    icon: 'SiHtml5',
  },
  {
    name: 'CSS',
    category: 'Technical Skills',
    description: 'Modern layouts with Flexbox, Grid, and design systems.',
    icon: 'SiCss3',
  },
  {
    name: 'C',
    category: 'Technical Skills',
    description: 'Systems programming foundations and performance-sensitive modules.',
    icon: 'SiC',
  },
  {
    name: 'Python',
    category: 'Technical Skills',
    description: 'Scripting, machine learning, automation, and data pipelines.',
    icon: 'FaPython',
  },
  {
    name: 'JavaScript',
    category: 'Technical Skills',
    description: 'Interactive web experiences and full-stack applications.',
    icon: 'SiJavascript',
  },
  {
    name: 'TypeScript',
    category: 'Technical Skills',
    description: 'Typed React apps and large-scale JavaScript codebases.',
    icon: 'SiTypescript',
  },
  {
    name: 'Java',
    category: 'Technical Skills',
    description: 'Backend services, APIs, and enterprise integrations.',
    icon: 'FaJava',
  },
  {
    name: 'C++',
    category: 'Technical Skills',
    description: 'High-performance components and optimized algorithms.',
    icon: 'SiCplusplus',
  },
  {
    name: 'Docker',
    category: 'Technical Skills',
    description: 'Containerizing workloads and reproducible development environments.',
    icon: 'FaDocker',
  },
  {
    name: 'Kubernetes',
    category: 'Technical Skills',
    description: 'Orchestrating scalable services and machine learning workloads.',
    icon: 'SiKubernetes',
  },
  {
    name: 'Git',
    category: 'Technical Skills',
    description: 'Version control, branching strategies, and review workflows.',
    icon: 'FaGitAlt',
  },
  {
    name: 'CI/CD',
    category: 'Technical Skills',
    description: 'Automated testing, deployments, and workflow automation.',
    icon: 'FaTools',
  },
  {
    name: 'Grafana',
    category: 'Technical Skills',
    description: 'Observability dashboards and production telemetry.',
    icon: 'SiGrafana',
  },
  {
    name: 'DVC',
    category: 'Technical Skills',
    description: 'Versioned machine learning datasets and experiment tracking.',
    icon: 'SiDvc',
  },
  {
    name: 'Microsoft Azure',
    category: 'Technical Skills',
    description: 'Cloud infrastructure, ML services, and data pipelines on Azure.',
    icon: 'SiMicrosoftazure',
  },
  {
    name: 'Amazon Web Services (AWS)',
    category: 'Technical Skills',
    description: 'Serverless, compute, and managed ML workloads across AWS.',
    icon: 'FaAws',
  },
  {
    name: 'Google Cloud Platform (GCP)',
    category: 'Technical Skills',
    description: 'Data engineering and ML orchestration on Google Cloud.',
    icon: 'SiGooglecloud',
  },
  {
    name: 'Google Cloud Vertex AI',
    category: 'Technical Skills',
    description: 'Managed training pipelines, feature stores, and model deployment.',
    icon: 'FaCloud',
  },
  {
    name: 'PostgreSQL',
    category: 'Technical Skills',
    description: 'Relational modeling, tuning, and transactional workloads.',
    icon: 'SiPostgresql',
  },
  {
    name: 'MySQL',
    category: 'Technical Skills',
    description: 'Operational databases and analytics integrations.',
    icon: 'SiMysql',
  },
  {
    name: 'MongoDB',
    category: 'Technical Skills',
    description: 'Document stores and hybrid data models for fast iteration.',
    icon: 'SiMongodb',
  },
  {
    name: 'FastAPI',
    category: 'Technical Skills',
    description: 'High-performance Python APIs and microservices.',
    icon: 'SiFastapi',
  },
  {
    name: 'Django',
    category: 'Technical Skills',
    description: 'Full-stack web applications and admin tooling in Python.',
    icon: 'SiDjango',
  },
  {
    name: 'Flask',
    category: 'Technical Skills',
    description: 'Lightweight APIs and rapid prototyping for services.',
    icon: 'SiFlask',
  },
  {
    name: 'React',
    category: 'Technical Skills',
    description: 'Component-driven UI with hooks and modern state patterns.',
    icon: 'FaReact',
  },
  {
    name: 'Playwright',
    category: 'Technical Skills',
    description: 'End-to-end browser automation and regression suites.',
    icon: 'SiPlaywright',
  },
  {
    name: 'pytest',
    category: 'Technical Skills',
    description: 'Unit tests, fixtures, and automation frameworks for Python.',
    icon: 'SiPytest',
  },
  {
    name: 'PyTorch',
    category: 'Technical Skills',
    description: 'Deep learning research, training, and inference workflows.',
    icon: 'SiPytorch',
  },
  {
    name: 'TensorFlow',
    category: 'Technical Skills',
    description: 'Production ML models, serving, and MLOps integration.',
    icon: 'SiTensorflow',
  },
  {
    name: 'OpenAI API',
    category: 'Technical Skills',
    description: 'Generative AI integrations and tool-calling workflows.',
    icon: 'SiOpenai',
  },
  {
    name: 'Claude',
    category: 'Technical Skills',
    description: 'Anthropic model orchestration and safety-first prompting.',
    icon: 'FaRobot',
  },
  {
    name: 'Gemini',
    category: 'Technical Skills',
    description: 'Google multimodal model experimentation and deployment.',
    icon: 'FaStar',
  },
  {
    name: 'LangChain',
    category: 'Technical Skills',
    description: 'Agentic pipelines, retrieval, and tool integrations.',
    icon: 'FaLink',
  },
  {
    name: 'LlamaIndex',
    category: 'Technical Skills',
    description: 'Graph-based retrieval and knowledge routing for LLMs.',
    icon: 'FaSitemap',
  },
  {
    name: 'AutoGen',
    category: 'Technical Skills',
    description: 'Multi-agent collaboration and workflow automation.',
    icon: 'FaProjectDiagram',
  },
  {
    name: 'CrewAI',
    category: 'Technical Skills',
    description: 'Team-based AI agent coordination and governance.',
    icon: 'FaUsersCog',
  },
  {
    name: 'Retrieval-Augmented Generation (RAG)',
    category: 'Technical Skills',
    description: 'End-to-end retrieval augmented generation architectures.',
    icon: 'FaDatabase',
  },
  {
    name: 'Ragas',
    category: 'Technical Skills',
    description: 'LLM evaluation metrics, scoring, and quality dashboards.',
    icon: 'FaChartLine',
  },
  {
    name: 'NLTK',
    category: 'Technical Skills',
    description: 'Classical NLP preprocessing, tokenization, and analytics.',
    icon: 'FaLanguage',
  },
  {
    name: 'Text-to-Speech (TTS)',
    category: 'Technical Skills',
    description: 'Voice synthesis, audio UX prototyping, and accessibility.',
    icon: 'FaVolumeUp',
  },
  {
    name: 'DeepSeek',
    category: 'Technical Skills',
    description: 'Advanced model search, optimization, and evaluation.',
    icon: 'FaSearchPlus',
  },
  {
    name: 'FAISS',
    category: 'Technical Skills',
    description: 'Vector indexing and similarity search at scale.',
    icon: 'FaMicrochip',
  },
  {
    name: 'ChromaDB',
    category: 'Technical Skills',
    description: 'Managed embedding stores and retrieval APIs.',
    icon: 'FaPalette',
  },
  {
    name: 'Pinecone',
    category: 'Technical Skills',
    description: 'Production-grade vector databases and monitoring.',
    icon: 'FaTree',
  },
  {
    name: 'Power BI',
    category: 'Technical Skills',
    description: 'Interactive analytics dashboards and business intelligence.',
    icon: 'SiPowerbi',
  },
  {
    name: 'Critical Thinking',
    category: 'Soft Skills',
    description: 'Breaks down complex AI problems into clear decisions and next steps.',
    icon: 'FaLightbulb',
  },
  {
    name: 'Problem-Solving',
    category: 'Soft Skills',
    description: 'Rapidly experiments, measures outcomes, and unblocks delivery.',
    icon: 'FaTools',
  },
  {
    name: 'Analytical Reasoning',
    category: 'Soft Skills',
    description: 'Connects data signals with business outcomes to guide priorities.',
    icon: 'FaChartLine',
  },
  {
    name: 'Attention to Detail',
    category: 'Soft Skills',
    description: 'Maintains rigor across data quality, evaluations, and documentation.',
    icon: 'FaSearchPlus',
  },
  {
    name: 'Curiosity',
    category: 'Soft Skills',
    description: 'Explores new research, frameworks, and user feedback to improve AI products.',
    icon: 'FaStar',
  },
  {
    name: 'Cross-Functional Communication',
    category: 'Soft Skills',
    description: 'Keeps stakeholders aligned through clear updates and actionable storytelling.',
    icon: 'FaComments',
  },
  {
    name: 'Team Collaboration',
    category: 'Soft Skills',
    description: 'Partners with engineering, design, and go-to-market teams to ship together.',
    icon: 'FaUsers',
  },
  {
    name: 'Active Listening',
    category: 'Soft Skills',
    description: 'Synthesizes feedback from partners and users to refine solutions.',
    icon: 'FaVolumeUp',
  },
  {
    name: 'Technical Writing',
    category: 'Soft Skills',
    description: 'Creates specs, runbooks, and one-pagers that make complex systems understandable.',
    icon: 'FaLanguage',
  },
  {
    name: 'Presentation Skills',
    category: 'Soft Skills',
    description: 'Builds executive-ready narratives with clear metrics and tradeoffs.',
    icon: 'FaProjectDiagram',
  },
  {
    name: 'Adaptability',
    category: 'Soft Skills',
    description: 'Shifts priorities quickly as research, data, or product needs evolve.',
    icon: 'FaRoute',
  },
  {
    name: 'Continuous Learning',
    category: 'Soft Skills',
    description: 'Invests in emerging AI tooling and best practices to stay ahead.',
    icon: 'FaTree',
  },
  {
    name: 'Mentoring',
    category: 'Soft Skills',
    description: 'Supports teammates through pairing, feedback, and growth plans.',
    icon: 'FaChalkboardTeacher',
  },
  {
    name: 'Accountability',
    category: 'Soft Skills',
    description: 'Owns deliverables, communicates risks early, and closes the loop.',
    icon: 'FaClipboardCheck',
  },
  {
    name: 'Time Management',
    category: 'Soft Skills',
    description: 'Schedules workstreams, balances bandwidth, and protects focus time.',
    icon: 'FaClock',
  },
  {
    name: 'Emotional Intelligence',
    category: 'Soft Skills',
    description: 'Navigates team dynamics with empathy and constructive feedback.',
    icon: 'FaUsersCog',
  },
  {
    name: 'Creativity',
    category: 'Soft Skills',
    description: 'Pairs design thinking with AI capabilities to discover novel solutions.',
    icon: 'FaPalette',
  },
  {
    name: 'Product Thinking',
    category: 'Soft Skills',
    description: 'Aligns model decisions with user value, KPIs, and roadmap milestones.',
    icon: 'FaCogs',
  },
  {
    name: 'Initiative',
    category: 'Soft Skills',
    description: 'Takes ownership of ambiguous problems and moves them toward impact.',
    icon: 'FaRocket',
  },
  {
    name: 'Decision-Making Under Uncertainty',
    category: 'Soft Skills',
    description: 'Chooses paths with incomplete data while managing risk and optionality.',
    icon: 'FaBalanceScale',
  },
  {
    name: 'Resilience',
    category: 'Soft Skills',
    description: 'Stays focused through setbacks, iterations, and shifting constraints.',
    icon: 'FaShieldAlt',
  },
  {
    name: 'Persistence',
    category: 'Soft Skills',
    description: 'Continues refining solutions until quality, adoption, and metrics land.',
    icon: 'FaRoad',
  },
  {
    name: 'Artificial Intelligence',
    category: 'Domain Expertise',
    description: 'End-to-end understanding of AI systems from ideation to production.',
    icon: 'FaBrain',
  },
  {
    name: 'Machine Learning',
    category: 'Domain Expertise',
    description: 'Supervised, unsupervised, and ensemble methods delivered at scale.',
    icon: 'FaCogs',
  },
  {
    name: 'Deep Learning',
    category: 'Domain Expertise',
    description: 'Neural architectures, embeddings, and large model training loops.',
    icon: 'FaMicrochip',
  },
  {
    name: 'Computer Vision',
    category: 'Domain Expertise',
    description: 'Image and video pipelines, detection, and multimodal analysis.',
    icon: 'FaSearchPlus',
  },
  {
    name: 'Natural Language Processing (NLP)',
    category: 'Domain Expertise',
    description: 'Tokenization, transformers, and conversational AI experiences.',
    icon: 'FaLanguage',
  },
  {
    name: 'Reinforcement Learning',
    category: 'Domain Expertise',
    description: 'Policy optimization and reward design for adaptive agents.',
    icon: 'FaRoute',
  },
  {
    name: 'Generative AI',
    category: 'Domain Expertise',
    description: 'Diffusion, autoregressive models, and creative content workflows.',
    icon: 'FaRobot',
  },
  {
    name: 'Retrieval-Augmented Generation (RAG)',
    category: 'Domain Expertise',
    description: 'Grounds LLMs with enterprise knowledge bases and evaluation loops.',
    icon: 'FaDatabase',
  },
  {
    name: 'Fine-Tuning & Transfer Learning',
    category: 'Domain Expertise',
    description: 'Specializes foundation models for domain-specific performance.',
    icon: 'FaTools',
  },
  {
    name: 'Hyperparameter Optimization',
    category: 'Domain Expertise',
    description: 'Search strategies, sweeps, and tuning frameworks for best-in-class models.',
    icon: 'FaChartLine',
  },
  {
    name: 'Model Training & Evaluation',
    category: 'Domain Expertise',
    description: 'Experiment design, validation suites, and production monitoring.',
    icon: 'FaClipboardCheck',
  },
  {
    name: 'Data Science',
    category: 'Domain Expertise',
    description: 'Exploratory analysis, feature engineering, and storytelling with data.',
    icon: 'FaDatabase',
  },
  {
    name: 'Statistical Modeling',
    category: 'Domain Expertise',
    description: 'Probabilistic methods, inference, and uncertainty quantification.',
    icon: 'FaChartLine',
  },
  {
    name: 'Predictive Analytics',
    category: 'Domain Expertise',
    description: 'Forecasting and decision-support models for critical metrics.',
    icon: 'FaChartLine',
  },
  {
    name: 'Automation & Intelligent Agents',
    category: 'Domain Expertise',
    description: 'Agentic workflows, tool routing, and real-time orchestration.',
    icon: 'FaRobot',
  },
  {
    name: 'MLOps & Model Deployment',
    category: 'Domain Expertise',
    description: 'CI/CD for models, feature stores, and monitoring in production.',
    icon: 'FaCloud',
  },
  {
    name: 'Cloud AI Engineering',
    category: 'Domain Expertise',
    description: 'Designs resilient cloud architectures for AI workloads.',
    icon: 'FaCloud',
  },
  {
    name: 'Software Engineering',
    category: 'Domain Expertise',
    description: 'Delivers reliable services using modern software development practices.',
    icon: 'FaReact',
  },
  {
    name: 'Data Engineering',
    category: 'Domain Expertise',
    description: 'ETL pipelines, data modeling, and governance for analytics.',
    icon: 'FaDatabase',
  },
  {
    name: 'Applied Research & Experimentation',
    category: 'Domain Expertise',
    description: 'Bridges academic insights with production-ready prototypes.',
    icon: 'FaFlask',
  },
  {
    name: 'AI Product Development',
    category: 'Domain Expertise',
    description: 'Translates user needs into AI features with measurable ROI.',
    icon: 'FaLightbulb',
  },
  {
    name: 'Prompt Engineering',
    category: 'Domain Expertise',
    description: 'System, user, and tool prompts optimized for reliability and safety.',
    icon: 'FaComments',
  },
  {
    name: 'Human-AI Interaction',
    category: 'Domain Expertise',
    description: 'Designs collaborative experiences between people and intelligent systems.',
    icon: 'FaUsers',
  },
  {
    name: 'Model Optimization & Performance Tuning',
    category: 'Domain Expertise',
    description: 'Prunes, quantizes, and distills models for latency and cost targets.',
    icon: 'FaMicrochip',
  },
  {
    name: 'Electronic Health Records (EHR) Management',
    category: 'Domain Expertise',
    description: 'Builds HIPAA-aware data flows and clinical decision support tooling.',
    icon: 'FaHospitalUser',
  },
  {
    name: 'Financial Services & Risk Analytics',
    category: 'Domain Expertise',
    description: 'Detects fraud, scores risk, and supports regulatory reporting.',
    icon: 'FaMoneyBillWave',
  },
  {
    name: 'Ethical AI & Regulatory Compliance',
    category: 'Domain Expertise',
    description: 'Implements governance practices, audits, and policy alignment for AI.',
    icon: 'FaBalanceScale',
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