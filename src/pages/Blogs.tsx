import React from "react";
import "./Blogs.css";
import { FaMedium, FaLinkedin } from "react-icons/fa";

const blogs = [
  {
    title: "Building Agentic QA Pipelines",
    platform: "Medium",
    icon: <FaMedium />,
    link: "https://medium.com/@moazeez/building-agentic-qa-pipelines",
    description: "How I orchestrate LangChain, CrewAI, and Playwright to ship autonomous regression suites.",
  },
  {
    title: "Multimodal Reporting on AWS",
    platform: "Medium",
    icon: <FaMedium />,
    link: "https://medium.com/@moazeez/multimodal-reporting-on-aws",
    description: "Scaling dashboards with containerized inference and observability for enterprise stakeholders.",
  },
  {
    title: "From Prompt to Production",
    platform: "LinkedIn",
    icon: <FaLinkedin />,
    link: "https://www.linkedin.com/in/moazeez/",
    description: "Lessons learned deploying generative copilots across analytics, testing, and operations teams.",
  },
];

const Blogs: React.FC = () => {
  return (
    <div className="blogs-container">
      <h2 className="blogs-title">Thoughts &amp; Writing</h2>
      <p className="blogs-intro">Experiments, delivery patterns, and field notes from applied AI/ML work.</p>
      <div className="blogs-grid">
        {blogs.map((blog, index) => (
          <a
            href={blog.link}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card"
            style={{ '--delay': `${index * 0.2}s` } as React.CSSProperties}
          >
            <div className="blog-icon animated-icon">{blog.icon}</div>
            <div className="blog-info animated-text">
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-description">{blog.description}</p>
              <span className="blog-platform">{blog.platform}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
