import React from "react";
import "./Blogs.css";
import { Link } from "react-router-dom";
import { FaBolt } from "react-icons/fa";
import { normalizeCopy } from "../utils/typography";

type BlogPost = {
  slug: string;
  title: string;
  description: string;
  platform: string;
  badge?: string;
  icon: React.ComponentType;
  delay?: string;
};

const blogPosts: BlogPost[] = [
  {
    slug: "transformer",
    title: "Transformer Architecture Deep Dive",
    description:
      'A cinematic walkthrough of "Attention Is All You Need" with animations, intuition, and spam detection demo.',
    platform: "Portfolio Special",
    badge: "New",
    icon: FaBolt,
    delay: "0s",
  },
];

const Blogs: React.FC = () => {
  return (
    <div className="blogs-container">
      <h2 className="blogs-title">Thoughts &amp; Writing</h2>
      <p className="blogs-intro">
        Experiments, delivery patterns, and field notes from applied AI engineering and research.
      </p>
      <div className="blogs-grid">
        {blogPosts.map((post) => {
          const Icon = post.icon;
          return (
            <Link
              key={post.slug}
              to={`/blogs/${post.slug}`}
              className="blog-card"
              style={{ "--delay": post.delay ?? "0s" } as React.CSSProperties}
            >
              {post.badge && <span className="blog-badge">{normalizeCopy(post.badge)}</span>}
              <div className="blog-icon animated-icon">
                <Icon />
              </div>
              <div className="blog-info animated-text">
                <h3 className="blog-title">{normalizeCopy(post.title)}</h3>
                <p className="blog-description">{normalizeCopy(post.description)}</p>
                <span className="blog-platform">{normalizeCopy(post.platform)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Blogs;
