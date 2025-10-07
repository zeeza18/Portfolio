import React from "react";
import "./Recommendations.css";
import chrisProfilePic from "../images/chris.jpg";

const Recommendations: React.FC = () => {
  return (
    <div className="timeline-container">
      <div className="recommendation-card">
        <div className="recommendation-header">
          <img src={chrisProfilePic} alt="Elena Carter" className="profile-pic" />
          <div>
            <h3>Elena Carter</h3>
            <p>Director, Applied Intelligence · TekAnthem</p>
            <p className="date">January 12, 2025</p>
          </div>
        </div>
        <div className="recommendation-body">
          <p>
            “Mohammed architected the agentic QA initiative that now underpins our enterprise release
            pipeline. He paired deep ML expertise with pragmatic engineering instincts, and the result
            was a platform that automates what used to be manual escalation. Incident recovery times
            dropped by over 70%, and Mohammed charted every step with clear documentation and demos for
            leadership.”
          </p>
          <p>
            “What impressed me most was his ability to translate ambiguous product requirements into a
            reliable roadmap. Mohammed orchestrated LangChain, CrewAI, and containerized inference with a
            calm, collaborative style—he routinely pulled in designers, QA, and DevOps to keep everyone
            aligned. The teams trusted him because he listened first, then delivered tangible progress.”
          </p>
          <p>
            “Any organization looking to move faster with intelligent automation will benefit from his
            mindset. Mohammed brings the rigor of a researcher and the pace of a product engineer; I’d
            partner with him again in a heartbeat.”
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
