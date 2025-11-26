import React, { useEffect, useMemo, useState } from 'react';
import './Projects.css';
import {
  FaReact,
  FaNodeJs,
  FaAws,
  FaDatabase,
  FaDocker,
  FaAngular,
  FaGithub,
  FaGitlab,
  FaGoogle,
  FaJava,
  FaJenkins,
  FaMicrosoft,
  FaPython,
  FaVuejs,
  FaCode,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import {
  SiRubyonrails,
  SiPostgresql,
  SiMongodb,
  SiMaterialdesign,
  SiHtml5,
  SiCss3,
  SiJquery,
  SiAwsamplify,
  SiFirebase,
  SiTerraform,
  SiArgo,
} from 'react-icons/si';
import { GrDeploy, GrKubernetes } from 'react-icons/gr';
import { Project } from '../types';
import { getProjects } from '../queries/getProjects';

type ProjectWithGithub = Project & {
  repoUrl?: string;
  liveUrl?: string | null;
  topics?: string[];
  techStack?: string[];
};

const techIcons: { [key: string]: JSX.Element } = {
  'ReactJS': <FaReact />,
  'NodeJS': <FaNodeJs />,
  'AWS': <FaAws />,
  'PostgreSQL': <SiPostgresql />,
  'MongoDB': <SiMongodb />,
  'Ruby On Rails': <SiRubyonrails />,
  'Material UI': <SiMaterialdesign />,
  'HTML5': <SiHtml5 />,
  'CSS3': <SiCss3 />,
  'jQuery': <SiJquery />,
  'AWS-ECS': <SiAwsamplify />,
  Cognito: <FaAws />,
  Lambda: <FaAws />,
  ECS: <FaAws />,
  Jenkins: <FaJenkins />,
  Docker: <FaDocker />,
  GraphQL: <FaDatabase />,
  'CI/CD': <FaGitlab />,
  GitLab: <FaGitlab />,
  GitHub: <FaGithub />,
  Heroku: <GrDeploy />,
  Netlify: <GrDeploy />,
  Firebase: <SiFirebase />,
  GCP: <FaGoogle />,
  Azure: <FaMicrosoft />,
  Kubernetes: <GrKubernetes />,
  Terraform: <SiTerraform />,
  ArgoCD: <SiArgo />,
  Java: <FaJava />,
  'Spring Boot': <FaJava />,
  Python: <FaPython />,
  'Node.js': <FaNodeJs />,
  'Express.js': <FaNodeJs />,
  Hibernate: <FaJava />,
  Maven: <FaJava />,
  Gradle: <FaJava />,
  JUnit: <FaJava />,
  Mockito: <FaJava />,
  Jest: <FaReact />,
  React: <FaReact />,
  Angular: <FaAngular />,
  'Vue.js': <FaVuejs />,
  'Next.js': <FaReact />,
  Gatsby: <FaReact />,
  'Nuxt.js': <FaVuejs />,
  Redux: <FaReact />,
  Vuex: <FaVuejs />,
  'Tailwind CSS': <SiCss3 />,
  Bootstrap: <SiCss3 />,
  JQuery: <SiJquery />,
};

const fallbackIcon = <FaCode />;

type GithubRepoConfig = {
  owner: string;
  repo: string;
  imageOverride?: string;
  descriptionOverride?: string;
  techStack?: string[];
  liveUrl?: string | null;
};

const githubRepos: GithubRepoConfig[] = [
  {
    owner: 'zeeza18',
    repo: 'ZEEJAI-Hyper-Chat',
    imageOverride: 'https://opengraph.githubassets.com/1/zeeza18/ZEEJAI-Hyper-Chat',
    descriptionOverride: 'Multi-agent conversational AI system decomposing complex queries into subtasks, orchestrating specialized agents with routing logic, and grounding responses through retrieval-augmented generation with reinforcement learning feedback.',
    techStack: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'Unsloth', 'Docker'],
  },
  {
    owner: 'zeeza18',
    repo: 'EFFICIENT_TRANSFORMER',
    descriptionOverride: 'Optimized transformer architecture implementing sparse attention mechanisms and memory-efficient techniques to process extended sequences with reduced computational overhead and faster inference for production deployments.',
    techStack: ['Python', 'PyTorch', 'Transformers', 'CUDA', 'Flash Attention', 'Triton'],
  },
  {
    owner: 'zeeza18',
    repo: 'HistColoriful-Colorizing-Grayscale-Images-Using-Conditional-GANs',
    descriptionOverride: 'Conditional generative adversarial network trained on paired image data to automatically colorize grayscale photographs, learning realistic color distributions while preserving structural details through adversarial loss and perceptual metrics.',
    techStack: ['Python', 'PyTorch', 'GAN', 'OpenCV', 'Albumentations', 'TensorBoard'],
  },
  {
    owner: 'zeeza18',
    repo: 'Plane-Crasher-RL',
    descriptionOverride: 'Reinforcement learning environment simulating aircraft navigation scenarios where agents learn collision avoidance policies through proximal policy optimization, experience replay buffers, and reward shaping for stable convergence.',
    techStack: ['Python', 'OpenAI Gym', 'PyTorch', 'Stable-Baselines3', 'NumPy', 'Matplotlib'],
  },
  {
    owner: 'zeeza18',
    repo: 'SKEEZ-SKIN-DISEASE-ANALYZER',
    descriptionOverride: 'Deep learning system analyzing skin lesion images with convolutional neural networks to classify dermatological conditions, providing probability scores and visual attention maps for clinical decision support.',
    techStack: ['Python', 'TensorFlow', 'CNN', 'Flask', 'OpenCV', 'NumPy'],
  },
  {
    owner: 'zeeza18',
    repo: 'MEDICAL-RAG',
    descriptionOverride: 'Retrieval-augmented generation pipeline combining vector search over medical literature with large language models to answer clinical queries with cited evidence and source attribution for verification.',
    techStack: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'OpenAI', 'FAISS'],
  },
  {
    owner: 'zeeza18',
    repo: 'Health-GPT',
    descriptionOverride: 'Conversational AI assistant built on transformer models, integrating medical knowledge bases with context-aware dialogue management to provide personalized wellness guidance and triage recommendations.',
    techStack: ['Python', 'LangChain', 'GPT-4', 'Redis', 'PostgreSQL', 'FastAPI'],
  },
  {
    owner: 'zeeza18',
    repo: 'Movie-Recommendation-System',
    descriptionOverride: 'Collaborative filtering engine leveraging matrix factorization and cosine similarity to generate personalized film recommendations from user rating history and content features with continuous model refinement.',
    techStack: ['Python', 'Pandas', 'Scikit-learn', 'NumPy', 'MySQL', 'Flask'],
    liveUrl: null,
  },
  {
    owner: 'zeeza18',
    repo: 'Cotton-Disease-Detector',
    descriptionOverride: 'Computer vision pipeline using transfer learning on pre-trained CNNs to identify plant leaf pathologies from RGB images, achieving multi-class disease classification with augmentation and ensemble methods.',
    techStack: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'MobileNet', 'Flask'],
  },
  {
    owner: 'zeeza18',
    repo: 'Australian-Rain-Predictor',
    descriptionOverride: 'Binary classification model using gradient boosting and feature engineering on meteorological time-series data to forecast next-day precipitation with calibrated probability outputs and hyperparameter optimization.',
    techStack: ['Python', 'XGBoost', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Seaborn'],
  },
  {
    owner: 'zeeza18',
    repo: 'FLIGHT-PRICE-PREDICTION',
    descriptionOverride: 'Regression pipeline incorporating temporal features, route encoding, and carrier attributes to predict airfare pricing, utilizing ensemble methods and cross-validation for robust fare estimation across diverse routes.',
    techStack: ['Python', 'Pandas', 'XGBoost', 'Scikit-learn', 'CatBoost', 'Flask'],
  },
  {
    owner: 'zeeza18',
    repo: 'Versatile-Search-Engine',
    descriptionOverride: 'Hybrid search system combining BM25 keyword matching with dense vector embeddings for semantic retrieval, implementing re-ranking algorithms and caching strategies to deliver fast, contextually relevant search results.',
    techStack: ['Python', 'FastAPI', 'ElasticSearch', 'Sentence-BERT', 'Redis', 'React'],
  },
];

const stripMarkdown = (text: string) =>
  text
    // Remove fenced code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    // Remove inline code
    .replace(/`([^`]*)`/g, '$1')
    // Remove images/links
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*\]\(([^)]+)\)/g, '$1')
    // Remove headings/quotes/emphasis
    .replace(/#+\s/g, '')
    .replace(/>\s?/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    // Strip HTML tags like <div align="center">
    .replace(/<[^>]*>/g, ' ')
    // Collapse whitespace
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const limitWords = (text: string, maxWords = 60) => {
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length <= maxWords) return text.trim();
  return `${parts.slice(0, maxWords).join(' ')}…`;
};

const cleanTitle = (title: string) => {
  return title.replace(/[-_]/g, ' ').trim();
};

const fetchGithubProject = async (config: GithubRepoConfig): Promise<ProjectWithGithub | null> => {
  try {
    const repoResponse = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`);
    if (!repoResponse.ok) {
      throw new Error(`Unable to load repo ${config.owner}/${config.repo}`);
    }
    const repoData = await repoResponse.json() as {
      name: string;
      description: string;
      html_url: string;
      homepage?: string | null;
      topics?: string[];
    };

    const topics = Array.isArray(repoData.topics) ? repoData.topics : [];
    const descriptionText = stripMarkdown(repoData.description ?? '').trim();
    const bodyText = config.descriptionOverride || descriptionText || 'GitHub project';
    const repoLink = repoData.html_url || `https://github.com/${config.owner}/${config.repo}`;

    return {
      title: repoData.name ?? config.repo,
      description: bodyText,
      techUsed: topics.join(', '),
      image: { url: config.imageOverride ?? `https://opengraph.githubassets.com/1/${config.owner}/${config.repo}` },
      repoUrl: repoLink,
      liveUrl: 'liveUrl' in config ? config.liveUrl : (repoData.homepage ?? null),
      topics,
      techStack: config.techStack,
    };
  } catch (error) {
    console.warn('Unable to load GitHub project, using config fallback.', error);
    const fallbackDescription = config.descriptionOverride || 'GitHub project';
    return {
      title: config.repo,
      description: fallbackDescription,
      techUsed: '',
      image: { url: config.imageOverride ?? `https://opengraph.githubassets.com/1/${config.owner}/${config.repo}` },
      repoUrl: `https://github.com/${config.owner}/${config.repo}`,
      liveUrl: config.liveUrl ?? null,
      topics: [],
      techStack: config.techStack,
    };
  }
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectWithGithub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const githubProjects = await Promise.all(githubRepos.map(fetchGithubProject));
        const githubFiltered = githubProjects.filter(
          (project): project is ProjectWithGithub => Boolean(project)
        );
        setProjects(githubFiltered);
      } catch (error) {
        console.warn('Unable to load project data, showing fallback.', error);
        const fallback = await getProjects();
        setProjects(fallback);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const buildTechList = useMemo(
    () => (project: ProjectWithGithub) => {
      if (project.techStack && project.techStack.length > 0) {
        return project.techStack.slice(0, 6);
      }
      if (project.topics && project.topics.length > 0) {
        return project.topics.slice(0, 6);
      }
      if (project.techUsed) {
        return project.techUsed.split(',').map((tech) => tech.trim()).filter(Boolean).slice(0, 6);
      }
      return [];
    },
    []
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="projects-container">
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div
            key={index}
            className="project-card"
            style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
          >
            <img src={project.image.url} alt={project.title} className="project-image" />
            <div className="project-details">
              <h3>{cleanTitle(project.title)}</h3>
              <p>{limitWords(project.description ?? '')}</p>
              <div className="tech-used">
                {buildTechList(project).map((tech, i) => {
                  const icon = techIcons[tech] ?? fallbackIcon;
                  return (
                    <span key={i} className="tech-badge">
                      {icon} {tech}
                    </span>
                  );
                })}
              </div>
              <div className="project-actions">
                {project.repoUrl && (
                  <a className="project-button" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    <FaGithub /> Repo
                  </a>
                )}
                {project.liveUrl && (
                  <a className="project-button project-button--ghost" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <FaExternalLinkAlt /> Live
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
