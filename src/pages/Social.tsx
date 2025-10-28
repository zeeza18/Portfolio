import React, { useState } from 'react';
import './Social.css';
import lifeImage from '../images/social-life.png';

type SocialPost = {
  id: string;
  date: string;
  caption: string;
  location?: string;
  mediaUrl?: string;
  likes: number;
  liked?: boolean;
  tags?: string[];
};

const initialPosts: SocialPost[] = [
  {
    id: 'weekend-hike',
    date: 'May 4, 2025',
    location: 'Scarborough Bluffs',
    caption:
      'Sunrise hike with the crew before a hackathon weekend. Nothing resets focus like cold air and a lake horizon.',
    mediaUrl: lifeImage,
    likes: 18,
    tags: ['#weekendreset', '#foundersclub'],
  },
  {
    id: 'ai-meetup',
    date: 'April 22, 2025',
    location: 'Toronto AI Builders Meetup',
    caption:
      'Shared an alpha walkthrough of the agentic workflow I have been prototyping. Loved the energy in the room.',
    mediaUrl: '',
    likes: 27,
    tags: ['#community', '#LLMops'],
  },
  {
    id: 'coffee-notes',
    date: 'March 14, 2025',
    caption:
      'Solo coffee, journal, and a stack of research papers. Marking the experiments that actually shipped.',
    mediaUrl: '',
    likes: 12,
    tags: ['#makerlife', '#buildinpublic'],
  },
];

const Social: React.FC = () => {
  const [posts, setPosts] = useState(initialPosts);

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            }
          : post
      )
    );
  };

  return (
    <section className="social-container">
      <header className="social-hero">
        <div className="social-hero-copy">
          <h2 className="social-title">Social Highlights</h2>
          <p className="social-subtitle">
            Swap in snapshots from your travels, meetups, and recharge rituals. Update each entry with your own photo,
            date, and story to keep the reel real.
          </p>
        </div>
      </header>

      <div className="social-grid">
        {posts.map((post) => (
          <article key={post.id} className="social-card">
            {post.mediaUrl ? (
              <img src={post.mediaUrl} alt={post.caption} className="social-media" />
            ) : (
              <div className="social-media placeholder">
                <span>Add your photo</span>
              </div>
            )}
            <div className="social-card-body">
              <div className="social-meta">
                <time className="social-date">{post.date}</time>
                {post.location && <span className="social-location">{post.location}</span>}
              </div>
              <p className="social-caption">{post.caption}</p>
              {post.tags && (
                <div className="social-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="social-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <button
                type="button"
                className={`social-like-button ${post.liked ? 'liked' : ''}`}
                onClick={() => toggleLike(post.id)}
                aria-pressed={post.liked}
              >
                <span className="social-like-icon" aria-hidden="true">
                  &#9829;
                </span>
                <span className="social-like-count">{post.likes}</span>
                <span className="sr-only">{post.liked ? 'Unlike' : 'Like'} post shared on {post.date}</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      <footer className="social-footer">
        <p>
          Ready to personalise it? Swap the placeholder text or point each post&apos;s <code>mediaUrl</code> to your own
          hosted images.
        </p>
      </footer>
    </section>
  );
};

export default Social;


