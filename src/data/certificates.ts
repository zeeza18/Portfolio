import { Certification } from '../types';

const asset = (fileName: string) => `/certificates/${fileName}`;

export const CERTIFICATES: Certification[] = [
  {
    title: 'Career Essentials in Generative AI',
    issuer: 'Microsoft & LinkedIn',
    issuedDate: 'Sep 12, 2024',
    link: asset('career-essentials-genai-microsoft-linkedin.jpg'),
    imageUrl: asset('career-essentials-genai-microsoft-linkedin.jpg'),
    format: 'image',
    topics: ['GenAI', 'LLM', 'Prompt Engineering'],
    summary:
      'Completed the Microsoft x LinkedIn learning path focused on LLM architectures, responsible AI, and production GenAI workflows.',
  },
  {
    title: 'Internshala Data Science Training (6 Weeks)',
    issuer: 'Internshala',
    issuedDate: 'Aug 14, 2021',
    link: asset('internshala-data-science-6-weeks.pdf'),
    format: 'pdf',
    topics: ['Data Science', 'Python', 'EDA'],
    summary:
      'Hands-on 6 week program covering Python for analytics, statistics, and applied machine learning workflows.',
  },
  {
    title: 'Internshala Deep Learning Training (6 Weeks)',
    issuer: 'Internshala',
    issuedDate: 'Jan 12, 2022',
    link: asset('internshala-deep-learning-6-weeks.pdf'),
    format: 'pdf',
    topics: ['Neural Networks', 'Computer Vision'],
    summary:
      'Project-based training focused on building and tuning neural networks with TensorFlow and Keras.',
  },
  {
    title: 'All India Visionet AI Hackathon Runner-Up',
    issuer: 'Visionet Systems',
    issuedDate: undefined,
    link: asset('all-india-visionet-ai-hackathon-runner-up.jpg'),
    imageUrl: asset('all-india-visionet-ai-hackathon-runner-up.jpg'),
    format: 'image',
    topics: ['Hackathon', 'AI Innovation'],
    summary:
      'Recognized as runner-up at the All India Visionet AI Hackathon for building a production-ready AI solution.',
  },
  {
    title: 'Internshala Tableau Training (6 Weeks)',
    issuer: 'Internshala',
    issuedDate: 'Sep 08, 2021',
    link: asset('internshala-tableau-6-weeks.pdf'),
    format: 'pdf',
    topics: ['Data Visualization', 'Tableau'],
    summary:
      'Completed Tableau dashboards, storytelling, and KPI design to communicate insights effectively.',
  },
  {
    title: 'Internshala Core Java Training (6 Weeks)',
    issuer: 'Internshala',
    issuedDate: 'Oct 23, 2020',
    link: asset('internshala-core-java-6-weeks.pdf'),
    format: 'pdf',
    topics: ['Java', 'OOP'],
    summary:
      'Covered object oriented design, collections, and multithreading fundamentals using Core Java.',
  },
  {
    title: 'Internshala Programming with C & C++',
    issuer: 'Internshala',
    issuedDate: 'Dec 27, 2020',
    link: asset('internshala-programming-c-cpp.pdf'),
    format: 'pdf',
    topics: ['C', 'C++', 'Problem Solving'],
    summary:
      'Structured programming, pointers, and STL practice plus algorithmic problem solving exercises.',
  },
  {
    title: 'Internshala Statistics for Data Science (6 Weeks)',
    issuer: 'Internshala',
    issuedDate: 'Sep 20, 2021',
    link: asset('internshala-statistics-for-data-science.pdf'),
    format: 'pdf',
    topics: ['Statistics', 'Hypothesis Testing'],
    summary:
      'Probability, inferential statistics, and hypothesis testing techniques for real-world datasets.',
  },
  {
    title: 'Infosys Springboard: Introduction to AI',
    issuer: 'Infosys',
    issuedDate: 'Jul 02, 2022',
    link: asset('infosys-introduction-to-ai.pdf'),
    format: 'pdf',
    topics: ['Artificial Intelligence', 'AI Ethics'],
    summary:
      'Foundational AI concepts including knowledge representation, search, and responsible deployment.',
  },
  {
    title: 'Data Visualization Using Power BI',
    issuer: 'Great Learning',
    issuedDate: 'Sep 21, 2021',
    link: asset('greatlearning-powerbi-data-visualization.pdf'),
    format: 'pdf',
    topics: ['Power BI', 'Dashboards'],
    summary:
      'Built interactive BI reports highlighting DAX calculations, slicers, and executive-ready dashboards.',
  },
  {
    title: 'Awareness of Digital Transactions',
    issuer: 'Cognition',
    issuedDate: 'Apr 30, 2022',
    link: asset('awareness-digital-transaction-cognition.jpg'),
    imageUrl: asset('awareness-digital-transaction-cognition.jpg'),
    format: 'image',
    topics: ['Digital Literacy'],
    summary:
      'Community session certificate on safe digital transactions and financial inclusion best practices.',
  },
  {
    title: 'Awareness of Efficient Garbage Disposal System',
    issuer: 'Cognition',
    issuedDate: 'Apr 30, 2022',
    link: asset('awareness-efficient-garbage-disposal-cognition.png'),
    imageUrl: asset('awareness-efficient-garbage-disposal-cognition.png'),
    format: 'image',
    topics: ['Community Impact'],
    summary:
      'Workshop on designing smart waste-management solutions for urban sustainability initiatives.',
  },
  {
    title: 'Community Management Internship',
    issuer: 'Newton School',
    issuedDate: 'Jun 30, 2022',
    link: asset('newtonschool-community-management-internship.pdf'),
    format: 'pdf',
    topics: ['Community', 'Growth Marketing'],
    summary:
      'Six-month community management internship driving engagement, marketing campaigns, and outreach.',
  },
];
