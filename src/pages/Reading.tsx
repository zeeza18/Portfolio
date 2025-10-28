import React from 'react';
import './Reading.css';

type ResearchPaper = {
  title: string;
  authors: string;
  venue: string;
  summary: string;
  link: string;
  citation: string;
};

const researchPapers: ResearchPaper[] = [
  {
    citation: '[1]',
    title: 'Attention Is All You Need',
    authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, et al.',
    venue: 'NeurIPS - 2017',
    summary:
      'Introduced the Transformer architecture, replacing recurrence with multi-head self-attention and positional encoding to advance machine translation and beyond.',
    link: 'https://arxiv.org/pdf/1706.03762',
  },
  {
    citation: '[2]',
    title: 'Very Deep Convolutional Networks for Large-Scale Image Recognition',
    authors: 'Karen Simonyan, Andrew Zisserman',
    venue: 'arXiv - 2014',
    summary:
      'Established the VGG family of deep CNNs, showing that increasing depth with 3x3 convolutions unlocked major gains on ImageNet and transfer learning benchmarks.',
    link: 'https://arxiv.org/pdf/1409.1556',
  },
  {
    citation: '[3]',
    title: 'Training Language Models to Follow Instructions with Human Feedback',
    authors: 'Long Ouyang, Jeff Wu, Xu Jiang, et al.',
    venue: 'NeurIPS - 2022',
    summary:
      'Outlined the InstructGPT pipeline, aligning models with preference data via supervised finetuning and reinforcement learning from human feedback.',
    link: 'https://arxiv.org/pdf/2203.02155',
  },
  {
    citation: '[4]',
    title: 'Fast R-CNN',
    authors: 'Ross Girshick',
    venue: 'ICCV - 2015',
    summary:
      'Redesigned region-based object detection into an end-to-end trainable pipeline, dramatically accelerating training and inference while boosting mean average precision.',
    link: 'https://arxiv.org/pdf/1504.08083',
  },
  {
    citation: '[5]',
    title: 'You Only Look Once: Unified, Real-Time Object Detection',
    authors: 'Joseph Redmon, Santosh Divvala, Ross Girshick, Ali Farhadi',
    venue: 'CVPR - 2016',
    summary:
      'Presented YOLO, reframing detection as single-shot regression and introducing the real-time detection paradigm carried forward by later YOLO family models.',
    link: 'https://arxiv.org/pdf/1506.02640',
  },
  {
    citation: '[6]',
    title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale',
    authors: 'Alexey Dosovitskiy, Lucas Beyer, Alexander Kolesnikov, et al.',
    venue: 'ICLR - 2021',
    summary:
      'Introduced Vision Transformers, showing that pure Transformer encoders pre-trained on large image datasets outperform convolutional baselines on classification.',
    link: 'https://arxiv.org/pdf/2010.11929',
  },
  {
    citation: '[7]',
    title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
    authors: 'Jason Wei, Xuezhi Wang, Dale Schuurmans, et al.',
    venue: 'NeurIPS - 2022',
    summary:
      'Showed that prompting for intermediate reasoning steps unlocks major gains on arithmetic and commonsense benchmarks across many model families.',
    link: 'https://arxiv.org/pdf/2201.11903',
  },
  {
    citation: '[8]',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    authors: 'Tri Dao, Dan Fu, Stefano Ermon, et al.',
    venue: 'NeurIPS - 2022',
    summary:
      'Optimized attention kernels for GPU memory hierarchies, delivering exact attention that is 2-3x faster and substantially more memory efficient.',
    link: 'http://arxiv.org/pdf/2205.14135',
  },
  {
    citation: '[9]',
    title: 'Reformer: The Efficient Transformer',
    authors: 'Nikita Kitaev, Lukasz Kaiser, Anselm Levskaya',
    venue: 'ICLR - 2020',
    summary:
      'Explored reversible layers and locality-sensitive hashing attention to shrink memory requirements, enabling Transformers that operate on much longer sequences.',
    link: 'https://arxiv.org/pdf/2001.04451',
  },
  {
    citation: '[10]',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: 'Patrick Lewis, Ethan Perez, Aleksandra Piktus, et al.',
    venue: 'NeurIPS - 2020',
    summary:
      'Combined dense retrievers with sequence-to-sequence generators, showing that plugging external knowledge bases into large models boosts factual accuracy.',
    link: 'https://arxiv.org/pdf/2005.11401',
  },
  {
    citation: '[11]',
    title: 'DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models',
    authors: 'Damai Dai, Chengqi Deng, Chenggang Zhao, et al.',
    venue: 'arXiv - 2024',
    summary:
      'Dissected large mixture-of-experts training dynamics, introducing routing refinements that increase expert specialization and downstream efficiency.',
    link: 'https://arxiv.org/pdf/2401.06066',
  },
  {
    citation: '[12]',
    title: 'DeepSeek R1: Incentivizing Reasoning in Frontier Models',
    authors: 'DeepSeek-AI',
    venue: 'arXiv - 2025',
    summary:
      'Detailed reinforcement distillation strategies for capturing deliberate chain-of-thought traces while maintaining latency and energy budgets in deployment.',
    link: 'https://arxiv.org/pdf/2501.12948',
  },
  {
    citation: '[13]',
    title: 'gpt-oss-120b & gpt-oss-20b Model Card',
    authors: 'OpenAI et al.',
    venue: 'arXiv - 2025',
    summary:
      'Documented the release of open-source GPT-scale models, including training data curation, evaluation benchmarks, and safety mitigations for community reuse.',
    link: 'https://arxiv.org/pdf/2508.10925',
  },
  {
    citation: '[14]',
    title: 'Reinforcement Learning from Human Feedback',
    authors: 'Nathan Lambert',
    venue: 'arXiv - 2025',
    summary:
      'Surveyed RLHF techniques end-to-end, connecting supervised preference modeling with policy optimization for aligning powerful generative models.',
    link: 'https://arxiv.org/pdf/2504.12501',
  },
];

const Reading: React.FC = () => (
  <section className="reading-container">
    <header className="reading-header">
      <h2 className="reading-title">What I'm Reading</h2>
      <p className="reading-intro">
        I track the research that shapes how I think about AI systems, scaling strategies, and model
        alignment. These are the papers that recently left a mark.
      </p>
    </header>
    <ul className="paper-list">
      {researchPapers.map((paper) => (
        <li key={paper.title} className="paper-card">
          <div className="paper-venue">
            <span className="paper-citation">{paper.citation}</span>
            <span>{paper.venue}</span>
          </div>
          <h3 className="paper-title">{paper.title}</h3>
          <div className="paper-authors">{paper.authors}</div>
          <p className="paper-summary">{paper.summary}</p>
          <a
            href={paper.link}
            target="_blank"
            rel="noreferrer"
            className="paper-link"
          >
            Read paper
          </a>
        </li>
      ))}
    </ul>
  </section>
);

export default Reading;
