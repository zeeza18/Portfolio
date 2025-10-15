import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Transformer.css';
import heroImage from '../images/blog.png';
import logoMark from '../images/wordmark.png';
import introSound from '../netflix-sound.mp3';

type TocEntry = {
  id: string;
  title: string;
  level: number;
};

type StepHighlight = {
  label: string;
  value: string;
  hint?: string;
};

type StepTable = {
  columns: string[];
  rows: string[][];
};

type StepData = {
  title: string;
  subtitle: string;
  narrative: string;
  highlights: StepHighlight[];
  table?: StepTable;
  code?: string;
};

type StackCard = {
  title: string;
  items: string[];
  variant?: 'accent' | 'highlight';
};

type StackConfig = {
  modifierClass: string;
  eyebrow: string;
  heading: string;
  description: string;
  cards: StackCard[];
};

const Transformer: React.FC = () => {
  const [html, setHtml] = useState<string>('');
  const [toc, setToc] = useState<TocEntry[]>([]);
  const articleRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [sequenceStarted, setSequenceStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const articleHtml = html || '<p class="transformer-loading">Preparing transformer insights...</p>';

  useEffect(() => {
    const sourceUrl = `${process.env.PUBLIC_URL}/content/transformer_guide.md`;

    fetch(sourceUrl)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Unable to load transformer guide (${response.status})`);
        }
        const markdown = await response.text();
        const { html: renderedHtml, toc: generatedToc } = renderMarkdownWithToc(markdown);
        setHtml(renderedHtml);
        setToc(generatedToc);
      })
      .catch((error) => {
        console.error('Unable to load transformer guide.', error);
        setHtml('<p class="transformer-error">Unable to load transformer guide. Please try again later.</p>');
        setToc([]);
      });
  }, []);

  useEffect(() => {
    const articleEl = articleRef.current;
    if (!articleEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('transformer-in-view');
          }
        });
      },
      {
        rootMargin: '0px 0px -20% 0px',
        threshold: 0.2,
      }
    );

    const animatedNodes = articleEl.querySelectorAll(':scope > *');
    animatedNodes.forEach((node) => observer.observe(node));

    return () => {
      animatedNodes.forEach((node) => observer.unobserve(node));
      observer.disconnect();
    };
  }, [html]);

  const transformerSteps = useMemo<StepData[]>(
    () => [
      {
        title: 'Step 1 - Tokenize & Embed',
        subtitle: 'Convert the email into vectors the model can understand.',
        narrative:
          'We strip markup, split the email into tokens, and project each token into a 512-dimensional embedding so attention can compare them.',
        highlights: [
          { label: 'Raw email', value: '"Limited time offer: claim your prize before midnight."' },
          { label: 'Tokens', value: '<START>, limited, time, offer, claim, prize, midnight, <END>' },
          { label: 'Embedding norm', value: '~1.00 per token', hint: 'Layer norm keeps magnitudes stable.' },
        ],
        table: {
          columns: ['Token', 'Embedding snippet'],
          rows: [
            ['<START>', '[0.11, 0.48, -0.07, ...]'],
            ['limited', '[0.92, 0.14, 0.22, ...]'],
            ['offer', '[0.88, 0.25, 0.31, ...]'],
            ['prize', '[0.73, -0.05, 0.44, ...]'],
            ['midnight', '[0.41, 0.62, -0.18, ...]'],
          ],
        },
      },
      {
        title: 'Step 2 - Build Q, K, V',
        subtitle: 'Project embeddings into query, key, and value spaces.',
        narrative:
          'Linear layers learn three perspectives on each token: what it wants (Q), what it offers (K), and what content it can share (V).',
        highlights: [
          { label: 'Projection matrices', value: 'WQ, WK, WV in R^512x64', hint: '8 heads x 64 dims each.' },
          { label: 'Example token', value: '"offer" -> Q=[0.52, 0.18, ...], K=[0.34, 0.27, ...]' },
          { label: 'Head count', value: '8 parallel attention heads' },
        ],
        table: {
          columns: ['Token', '||Q||', '||K||', '||V||'],
          rows: [
            ['limited', '0.93', '0.87', '1.02'],
            ['offer', '0.88', '0.90', '0.98'],
            ['claim', '0.81', '0.85', '0.94'],
            ['prize', '0.95', '0.89', '1.05'],
          ],
        },
        code: `Q = tokens * W_Q
K = tokens * W_K
V = tokens * W_V`,
      },
      {
        title: 'Step 3 - Attention Weights',
        subtitle: 'Compare every token to every other token.',
        narrative:
          'Dot products between queries and keys reveal which words influence each other. After scaling and softmax, we get attention weights.',
        highlights: [
          { label: 'Focus token', value: '"offer"', hint: 'Likely spam keyword.' },
          { label: 'Top alignment', value: 'offer <-> prize = 0.71' },
          { label: 'Background', value: 'Context words like "midnight" still contribute (0.18).' },
        ],
        table: {
          columns: ['focus ->', 'limited', 'offer', 'prize', 'midnight'],
          rows: [
            ['limited', '0.32', '0.41', '0.17', '0.10'],
            ['offer', '0.12', '0.19', '0.71', '0.18'],
            ['prize', '0.08', '0.24', '0.56', '0.12'],
            ['midnight', '0.18', '0.22', '0.24', '0.36'],
          ],
        },
        code: `weights = softmax((Q * K^T) / sqrt(d_k))`,
      },
      {
        title: 'Step 4 - Context Vector',
        subtitle: 'Mix values using the learned attention weights.',
        narrative:
          'Weighted sums of V vectors capture the meaning at each position. Feed-forward blocks refine these contextual signals.',
        highlights: [
          { label: 'Offer context', value: '[0.68, 0.14, 0.42, ...]' },
          { label: 'FFN output', value: '[0.91, 0.04, -0.12, ...]' },
          { label: 'Dropout', value: 'p = 0.1', hint: 'Prevents overfitting to spam keywords.' },
        ],
        code: `context_offer = sum_j weights_offer,j * V_j
ffn_offer = GELU(context_offer * W_1 + b_1) * W_2 + b_2`,
      },
      {
        title: 'Step 5 - Spam Classifier',
        subtitle: 'Feed-forward head predicts spam probability.',
        narrative:
          'The classification head pools the <START> representation and applies a linear layer plus softmax to label the email.',
        highlights: [
          { label: 'Logits', value: '[spam: 2.11, ham: 1.32]' },
          { label: 'Softmax', value: 'P(spam) = 0.82, P(ham) = 0.18' },
          { label: 'Decision', value: 'Flagged as spam', hint: 'Confidence passes 0.75 threshold.' },
        ],
        code: `scores = start_vector * W_cls + b_cls
prob = softmax(scores)
decision = prob_spam > 0.75`,
      },
    ],
    []
  );
  const activeStep = transformerSteps[stepIndex];

  const ensureAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(introSound);
    }
    return audioRef.current;
  };

  const handlePlaySequence = async () => {
    const audio = ensureAudio();
    try {
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.warn('Unable to play intro sound for the transformer demo.', error);
    }
    setSequenceStarted(true);
    setStepIndex(0);
  };

  const handleNext = () => {
    setSequenceStarted(true);
    setStepIndex((current) => Math.min(current + 1, transformerSteps.length - 1));
  };

  const handlePrev = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  return (
    <div className="transformer-page">
      <section className="transformer-hero">
        <div className="transformer-hero__bg" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="transformer-hero__overlay" />
        <div className="transformer-hero__content">
          <div className="transformer-hero__eyebrow">Deep Dive</div>
          <h1 className="transformer-hero__title">Transformers Explained</h1>
          <p className="transformer-hero__subtitle">
            From the first self-attention equations to modern large language models, this visual guide unpacks
            everything inside the architecture that changed AI forever.
          </p>
          <div className="transformer-hero__cta">
            <img src={logoMark} alt="Mohammed Azeezulla" />
            <div>
              <span className="transformer-hero__author">Mohammed Azeezulla</span>
              <span className="transformer-hero__meta">AI Engineer & Researcher - October 2025</span>
            </div>
          </div>
        </div>
      <div className="transformer-hero__glow" />
    </section>

      <section className="transformer-demo">
        <div className="transformer-demo__header">
          <h2>Spam Detection Walkthrough</h2>
          <p>
            Step through how a Transformer flags a suspicious email. Hit play to drop the Netflix sting and then use
            the controls to move from raw tokens to the final softmax verdict.
          </p>
          <div className="transformer-demo__controls">
            <button className="transformer-demo__play" type="button" onClick={handlePlaySequence}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4 3.514C4 2.508 5.095 1.89 5.94 2.428l14 8.486c.781.474.781 1.686 0 2.16l-14 8.486C5.095 22.09 4 21.472 4 20.466V3.514z"
                />
              </svg>
              <span>{sequenceStarted ? 'Replay & Restart Demo' : 'Begin Interactive Demo'}</span>
            </button>
            {sequenceStarted && (
              <div className="transformer-demo__progress">
                <div className="transformer-demo__progress-track">
                  <div
                    className="transformer-demo__progress-bar"
                    style={{ width: `${((stepIndex + 1) / transformerSteps.length) * 100}%` }}
                  />
                </div>
                <span>
                  Step {stepIndex + 1} / {transformerSteps.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {sequenceStarted && (
          <>
            <div className="transformer-demo__stage">
              <header>
                <h3>{activeStep.title}</h3>
                <p>{activeStep.subtitle}</p>
              </header>

              <div className="transformer-demo__narrative">
                <p>{activeStep.narrative}</p>
              </div>

              <div className="transformer-demo__content">
                <ul className="transformer-demo__highlights">
                  {activeStep.highlights.map((highlight) => (
                    <li key={highlight.label}>
                      <span className="transformer-demo__highlight-label">{highlight.label}</span>
                      <span className="transformer-demo__highlight-value">{highlight.value}</span>
                      {highlight.hint && <span className="transformer-demo__highlight-hint">{highlight.hint}</span>}
                    </li>
                  ))}
                </ul>

                <div className="transformer-demo__visual">
                  {activeStep.table && (
                    <table>
                      <thead>
                        <tr>
                          {activeStep.table.columns.map((column) => (
                            <th key={column}>{column}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeStep.table.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeStep.code && (
                    <pre>
                      <code>{activeStep.code}</code>
                    </pre>
                  )}
                </div>
              </div>
            </div>

            <div className="transformer-demo__nav">
              <button type="button" onClick={handlePrev} disabled={stepIndex === 0}>
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={stepIndex === transformerSteps.length - 1}
                className="transformer-demo__next"
              >
                {stepIndex === transformerSteps.length - 1 ? 'Done' : 'Next'}
              </button>
            </div>
          </>
        )}
      </section>

      <div className="transformer-body">
        {toc.length > 0 && (
          <aside className="transformer-toc">
            <div className="transformer-toc__title">Explore</div>
            <ul>
              {toc.map((item) => (
                <li key={item.id} className={`transformer-toc__item transformer-toc__item--level-${item.level}`}>
                  <a href={`#${item.id}`}>{item.title}</a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <article
          ref={articleRef}
          className="transformer-article"
          dangerouslySetInnerHTML={{ __html: articleHtml }}
        />
      </div>
    </div>
  );
};

export default Transformer;

function renderMarkdownWithToc(markdown: string): { html: string; toc: TocEntry[] } {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const htmlParts: string[] = [];
  const toc: TocEntry[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let tableBuffer: string[] | null = null;
  const slugCounts: Record<string, number> = {};

  const closeList = () => {
    if (!listType) return;
    htmlParts.push(`</${listType}>`);
    listType = null;
  };

  const flushCode = () => {
    if (!inCodeBlock) return;
    const code = codeBuffer.join('\n');
    const normalizedCode = code
      .replace(/\u2192/g, '->')
      .replace(/\u00d7/gi, 'x')
      .replace(/[\u2013\u2014]/g, '-')
      .trimStart();
    const normalizedForMatching = normalizedCode.toUpperCase();
    const isArchitectureDiagram =
      normalizedForMatching.includes('ENCODER X 6') &&
      normalizedForMatching.includes('DECODER X 6');
    const isEncoderStack = normalizedCode.startsWith('Input -> Embedding -> Positional Encoding');
    const isDecoderStack = normalizedCode.startsWith('Output (shifted right) -> Embedding -> Positional Encoding');

    if (isEncoderStack) {
      htmlParts.push(renderStack(encoderStackConfig));
    } else if (isDecoderStack) {
      htmlParts.push(renderStack(decoderStackConfig));
    } else if (isArchitectureDiagram) {
      htmlParts.push(renderArchitectureFigure());
    } else {
      htmlParts.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
    }
    codeBuffer = [];
    inCodeBlock = false;
  };

  const flushTable = () => {
    if (!tableBuffer || tableBuffer.length === 0) return;
    htmlParts.push(renderTable(tableBuffer));
    tableBuffer = null;
  };

  lines.forEach((rawLine) => {
    const line = rawLine.replace(/\s+$/g, '');

    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCode();
      } else {
        closeList();
        flushTable();
        inCodeBlock = true;
        codeBuffer = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (line.trim() === '') {
      flushTable();
      closeList();
      return;
    }

    if (line.trim().startsWith('|')) {
      if (!tableBuffer) {
        flushTable();
        closeList();
        tableBuffer = [];
      }
      tableBuffer.push(line.trim());
      return;
    }

    flushTable();

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = uniqueSlug(text, slugCounts);
      htmlParts.push(`<h${level} id="${id}">${inlineFormat(text)}</h${level}>`);
      if (level === 2 || level === 3) {
        toc.push({ id, title: text.replace(/`/g, ''), level });
      }
      return;
    }

    const orderedMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (orderedMatch) {
      if (listType !== 'ol') {
        closeList();
        htmlParts.push('<ol>');
        listType = 'ol';
      }
      htmlParts.push(`<li>${inlineFormat(orderedMatch[1].trim())}</li>`);
      return;
    }

    const unorderedMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    if (unorderedMatch) {
      if (listType !== 'ul') {
        closeList();
        htmlParts.push('<ul>');
        listType = 'ul';
      }
      htmlParts.push(`<li>${inlineFormat(unorderedMatch[1].trim())}</li>`);
      return;
    }

    closeList();
    htmlParts.push(`<p>${inlineFormat(line.trim())}</p>`);
  });

  flushTable();
  closeList();
  flushCode();

  return {
    html: htmlParts.join('\n'),
    toc,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inlineFormat(text: string): string {
  let formatted = escapeHtml(text);
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/`(.+?)`/g, '<code>$1</code>');
  return formatted;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function uniqueSlug(text: string, slugCounts: Record<string, number>): string {
  const baseSlug = slugify(text);
  const currentCount = slugCounts[baseSlug] ?? 0;
  slugCounts[baseSlug] = currentCount + 1;
  return currentCount === 0 ? baseSlug : `${baseSlug}-${currentCount}`;
}

function renderTable(lines: string[]): string {
  if (lines.length < 2) {
    return `<p>${inlineFormat(lines.join(' '))}</p>`;
  }

  const rows = lines
    .map((line) => line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim()));

  const header = rows[0];
  const separator = rows[1];
  const isSeparatorRow = separator.every((cell) => /^:?[-]+:?$/.test(cell));
  const bodyRows = isSeparatorRow ? rows.slice(2) : rows.slice(1);

  const headerHtml = `<tr>${header.map((cell) => `<th>${inlineFormat(cell)}</th>`).join('')}</tr>`;
  const bodyHtml = bodyRows
    .map((row) => `<tr>${row.map((cell) => `<td>${inlineFormat(cell)}</td>`).join('')}</tr>`)
    .join('');

  return `<table>${headerHtml}${bodyHtml}</table>`;
}

const encoderStackConfig: StackConfig = {
  modifierClass: 'transformer-stack--encoder',
  eyebrow: 'Encoder Flow',
  heading: 'Contextualize the Input Sequence',
  description:
    'Tokens are embedded, blended with positional signals, then refined through stacked self-attention and feed-forward layers.',
  cards: [
    {
      title: 'Token Preparation',
      items: ['Raw tokens → 512-d embeddings', 'Add sin/cos positional encoding', 'Layer norm stabilizes magnitudes'],
    },
    {
      title: 'Self-Attention Block × 6',
      items: ['Multi-head attention connects every token to every other token', 'Residual + layer norm keep gradients flowing'],
      variant: 'accent',
    },
    {
      title: 'Feed-Forward Refinement',
      items: [
        'Position-wise MLP (ReLU/GELU) expands & compresses features',
        'Dropout (0.1) prevents co-adaptation',
        'Residual + norm ready representation for next layer',
      ],
    },
    {
      title: 'Encoded Representation',
      items: ['Rich context vector per position', 'Ready for cross-attention and downstream tasks'],
      variant: 'highlight',
    },
  ],
};

const decoderStackConfig: StackConfig = {
  modifierClass: 'transformer-stack--decoder',
  eyebrow: 'Decoder Flow',
  heading: 'Generate Outputs Autoregressively',
  description:
    'Shifted targets attend to prior tokens, reference the encoder memory, then predict the next token distribution.',
  cards: [
    {
      title: 'Shifted Inputs',
      items: ['[START] token plus previous predictions', 'Embedding + positional encoding'],
    },
    {
      title: 'Masked Self-Attention',
      items: ['Prevent peeking ahead with causal mask', 'Residual + norm maintain signal fidelity'],
      variant: 'accent',
    },
    {
      title: 'Encoder-Decoder Attention',
      items: ['Queries from decoder, keys/values from encoder', 'Align generated context with encoded memory'],
    },
    {
      title: 'Feed-Forward + Norm',
      items: ['Refine merged context', 'Repeat block 6 times'],
    },
    {
      title: 'Prediction Head',
      items: ['Linear projection → vocabulary logits', 'Softmax yields probabilities for next token'],
      variant: 'highlight',
    },
  ],
};

function renderStack(config: StackConfig): string {
  const cardsHtml = config.cards
    .map((card) => {
      const classes = ['transformer-stack__card'];

      if (card.variant === 'accent') {
        classes.push('transformer-stack__card--accent');
      } else if (card.variant === 'highlight') {
        classes.push('transformer-stack__card--highlight');
      }

      const itemsHtml = card.items.map((item) => `<li>${item}</li>`).join('');

      return `
    <div class="${classes.join(' ')}">
      <h4>${card.title}</h4>
      <ul>
        ${itemsHtml}
      </ul>
    </div>`;
    })
    .join('');

  return `
<div class="transformer-stack ${config.modifierClass}">
  <header>
    <span class="transformer-stack__eyebrow">${config.eyebrow}</span>
    <h3>${config.heading}</h3>
    <p>${config.description}</p>
  </header>
  <div class="transformer-stack__grid">
    ${cardsHtml}
  </div>
</div>`;
}

function renderArchitectureFigure(): string {
  return `
<figure class="transformer-figure transformer-figure--svg">
  <svg viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="transformer-diagram-title transformer-diagram-desc">
    <title id="transformer-diagram-title">Transformer Architecture</title>
    <desc id="transformer-diagram-desc">Diagram showing encoder and decoder stacks with attention and feed-forward blocks.</desc>
    <defs>
      <marker id="arrowhead-dark" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#94a3ff" />
      </marker>
      <marker id="arrowhead-contrast" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#f472b6" />
      </marker>
    </defs>
    <rect width="800" height="1000" fill="#0c1226" rx="24" />
    <text x="400" y="48" font-size="28" font-weight="700" text-anchor="middle" fill="#e2e8ff" letter-spacing="0.1em">
      Transformer Architecture
    </text>

    <!-- Encoder -->
    <g>
      <text x="200" y="90" font-size="18" font-weight="700" text-anchor="middle" fill="#7dd3fc" letter-spacing="0.2em">
        ENCODER
      </text>

      <rect x="120" y="110" width="160" height="52" rx="8" fill="#10213d" stroke="#38bdf8" stroke-width="2" />
      <text x="200" y="142" font-size="14" text-anchor="middle" fill="#dbeafe">Input Embedding</text>

      <rect x="120" y="182" width="160" height="52" rx="8" fill="#10213d" stroke="#38bdf8" stroke-width="2" />
      <text x="200" y="214" font-size="14" text-anchor="middle" fill="#dbeafe">Positional Encoding</text>

      <rect x="100" y="262" width="200" height="400" rx="14" fill="transparent" stroke="#38bdf8" stroke-width="3" stroke-dasharray="12 8" />
      <text x="200" y="288" font-size="12" text-anchor="middle" fill="#94a3ff">N×</text>

      <rect x="120" y="302" width="160" height="72" rx="10" fill="#1d4ed8" stroke="#1e293b" stroke-width="2" />
      <text x="200" y="330" font-size="13" font-weight="700" text-anchor="middle" fill="#f8fafc">Multi-Head</text>
      <text x="200" y="350" font-size="13" font-weight="700" text-anchor="middle" fill="#f8fafc">Self-Attention</text>

      <rect x="120" y="394" width="160" height="42" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2" />
      <text x="200" y="420" font-size="12" text-anchor="middle" fill="#cbd5f5">Add &amp; Norm</text>

      <rect x="120" y="450" width="160" height="72" rx="10" fill="#2563eb" stroke="#1e293b" stroke-width="2" />
      <text x="200" y="478" font-size="13" font-weight="700" text-anchor="middle" fill="#f8fafc">Feed Forward</text>
      <text x="200" y="498" font-size="13" font-weight="700" text-anchor="middle" fill="#f8fafc">Network</text>

      <rect x="120" y="542" width="160" height="42" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2" />
      <text x="200" y="568" font-size="12" text-anchor="middle" fill="#cbd5f5">Add &amp; Norm</text>

      <path d="M 200 162 L 200 182" stroke="#94a3ff" stroke-width="2" marker-end="url(#arrowhead-dark)" />
      <path d="M 200 234 L 200 262" stroke="#94a3ff" stroke-width="2" marker-end="url(#arrowhead-dark)" />
      <path d="M 200 374 L 200 394" stroke="#94a3ff" stroke-width="2" marker-end="url(#arrowhead-dark)" />
      <path d="M 200 436 L 200 450" stroke="#94a3ff" stroke-width="2" marker-end="url(#arrowhead-dark)" />
      <path d="M 200 522 L 200 542" stroke="#94a3ff" stroke-width="2" marker-end="url(#arrowhead-dark)" />
      <path d="M 200 584 L 200 674" stroke="#94a3ff" stroke-width="2" marker-end="url(#arrowhead-dark)" />
    </g>

    <!-- Decoder -->
    <g>
      <text x="600" y="90" font-size="18" font-weight="700" text-anchor="middle" fill="#fda4af" letter-spacing="0.2em">
        DECODER
      </text>

      <rect x="520" y="110" width="160" height="52" rx="8" fill="#24102d" stroke="#f87171" stroke-width="2" />
      <text x="600" y="142" font-size="14" text-anchor="middle" fill="#fde68a">Output Embedding</text>

      <rect x="520" y="182" width="160" height="52" rx="8" fill="#24102d" stroke="#f87171" stroke-width="2" />
      <text x="600" y="214" font-size="14" text-anchor="middle" fill="#fde68a">Positional Encoding</text>

      <rect x="500" y="262" width="200" height="434" rx="14" fill="transparent" stroke="#f87171" stroke-width="3" stroke-dasharray="12 8" />
      <text x="600" y="288" font-size="12" text-anchor="middle" fill="#fda4af">N×</text>

      <rect x="520" y="302" width="160" height="72" rx="10" fill="#b91c1c" stroke="#1e293b" stroke-width="2" />
      <text x="600" y="330" font-size="12" font-weight="700" text-anchor="middle" fill="#f8fafc">Masked Multi-Head</text>
      <text x="600" y="350" font-size="12" font-weight="700" text-anchor="middle" fill="#f8fafc">Self-Attention</text>

      <rect x="520" y="394" width="160" height="42" rx="8" fill="#1f0f24" stroke="#783b5e" stroke-width="2" />
      <text x="600" y="420" font-size="12" text-anchor="middle" fill="#fbcfe8">Add &amp; Norm</text>

      <rect x="520" y="450" width="160" height="72" rx="10" fill="#c2410c" stroke="#1e293b" stroke-width="2" />
      <text x="600" y="476" font-size="12" font-weight="700" text-anchor="middle" fill="#f8fafc">Multi-Head</text>
      <text x="600" y="496" font-size="12" font-weight="700" text-anchor="middle" fill="#f8fafc">Cross-Attention</text>

      <rect x="520" y="542" width="160" height="42" rx="8" fill="#1f0f24" stroke="#783b5e" stroke-width="2" />
      <text x="600" y="568" font-size="12" text-anchor="middle" fill="#fbcfe8">Add &amp; Norm</text>

      <rect x="520" y="598" width="160" height="72" rx="10" fill="#b91c1c" stroke="#1e293b" stroke-width="2" />
      <text x="600" y="626" font-size="13" font-weight="700" text-anchor="middle" fill="#f8fafc">Feed Forward</text>
      <text x="600" y="646" font-size="13" font-weight="700" text-anchor="middle" fill="#f8fafc">Network</text>

      <rect x="520" y="690" width="160" height="42" rx="8" fill="#1f0f24" stroke="#783b5e" stroke-width="2" />
      <text x="600" y="716" font-size="12" text-anchor="middle" fill="#fbcfe8">Add &amp; Norm</text>

      <path d="M 600 162 L 600 182" stroke="#fda4af" stroke-width="2" marker-end="url(#arrowhead-dark)" />
      <path d="M 600 234 L 600 262" stroke="#fda4af" stroke-width="2" marker-end="url(#arrowhead-dark)" />
      <path d="M 600 374 L 600 394" stroke="#fda4af" stroke-width="2" marker-end="url(#arrowhead-dark)" />
      <path d="M 600 436 L 600 450" stroke="#fda4af" stroke-width="2" marker-end="url(#arrowhead-dark)" />
      <path d="M 600 522 L 600 542" stroke="#fda4af" stroke-width="2" marker-end="url(#arrowhead-dark)" />
      <path d="M 600 584 L 600 598" stroke="#fda4af" stroke-width="2" marker-end="url(#arrowhead-dark)" />
      <path d="M 600 670 L 600 690" stroke="#fda4af" stroke-width="2" marker-end="url(#arrowhead-dark)" />
      <path d="M 600 732 L 600 782" stroke="#fda4af" stroke-width="2" marker-end="url(#arrowhead-dark)" />
    </g>

    <!-- Encoder to Decoder -->
    <path d="M 300 486 L 520 486" stroke="#f472b6" stroke-width="3" marker-end="url(#arrowhead-contrast)" />
    <text x="410" y="472" font-size="12" text-anchor="middle" fill="#f472b6" font-weight="700" letter-spacing="0.08em">
      Encoder Output
    </text>

    <!-- Output Layers -->
    <rect x="520" y="782" width="160" height="54" rx="10" fill="#16a34a" stroke="#052e16" stroke-width="2" />
    <text x="600" y="812" font-size="14" font-weight="700" text-anchor="middle" fill="#eafff3">Linear + Softmax</text>

    <rect x="520" y="852" width="160" height="54" rx="10" fill="#0ea5e9" stroke="#0c4a6e" stroke-width="2" />
    <text x="600" y="882" font-size="14" font-weight="700" text-anchor="middle" fill="#f8fafc">Output Probabilities</text>

    <path d="M 600 836 L 600 852" stroke="#fda4af" stroke-width="2" marker-end="url(#arrowhead-dark)" />
    <path d="M 600 906 L 600 920" stroke="#fda4af" stroke-width="2" marker-end="url(#arrowhead-dark)" />

    <!-- Legend -->
    <text x="400" y="962" font-size="12" text-anchor="middle" fill="#94a3ff">
      Attention Is All You Need — Vaswani et al., 2017
    </text>
  </svg>
  <figcaption>Transformer encoder-decoder flow from Vaswani et al., 2017.</figcaption>
</figure>`;
}
