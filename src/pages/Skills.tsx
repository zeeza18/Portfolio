import React, { useEffect, useState } from 'react';
import './Skills.css';
import { getSkills } from '../queries/getSkills';
import skillsSoftHard from '../images/skills-soft-hard.png';

import {
  FaReact,
  FaNodeJs,
  FaAws,
  FaDocker,
  FaGitAlt,
  FaJava,
  FaPython,
  FaBrain,
  FaRobot,
  FaUsers,
  FaChalkboardTeacher,
  FaHandshake,
  FaCogs,
  FaHospitalUser,
  FaChartLine,
  FaCloud,
  FaLink,
  FaSitemap,
  FaProjectDiagram,
  FaUsersCog,
  FaDatabase,
  FaLanguage,
  FaVolumeUp,
  FaSearchPlus,
  FaMicrochip,
  FaPalette,
  FaTree,
  FaStar,
  FaTools,
  FaComments,
  FaLightbulb,
  FaClipboardCheck,
  FaClock,
  FaFlask,
  FaBalanceScale,
  FaShieldAlt,
  FaMoneyBillWave,
  FaRoute,
  FaRocket,
  FaRoad,
} from 'react-icons/fa';
import {
  SiRubyonrails,
  SiTypescript,
  SiPostgresql,
  SiMysql,
  SiKubernetes,
  SiGooglecloud,
  SiSpringboot,
  SiPhp,
  SiNetlify,
  SiHeroku,
  SiHtml5,
  SiCss3,
  SiRabbitmq,
  SiImessage,
  SiJavascript,
  SiC,
  SiCplusplus,
  SiGrafana,
  SiDvc,
  SiMicrosoftazure,
  SiMongodb,
  SiFastapi,
  SiDjango,
  SiFlask,
  SiPlaywright,
  SiPytest,
  SiPytorch,
  SiTensorflow,
  SiOpenai,
  SiPowerbi,
} from 'react-icons/si';
import { Skill } from '../types';

const iconMap: { [key: string]: JSX.Element } = {
  FaReact: <FaReact />,
  FaNodeJs: <FaNodeJs />,
  FaAws: <FaAws />,
  FaDocker: <FaDocker />,
  FaGitAlt: <FaGitAlt />,
  FaJava: <FaJava />,
  FaPython: <FaPython />,
  FaBrain: <FaBrain />,
  FaRobot: <FaRobot />,
  FaUsers: <FaUsers />,
  FaChalkboardTeacher: <FaChalkboardTeacher />,
  FaHandshake: <FaHandshake />,
  FaCogs: <FaCogs />,
  FaHospitalUser: <FaHospitalUser />,
  FaChartLine: <FaChartLine />,
  FaCloud: <FaCloud />,
  FaLink: <FaLink />,
  FaSitemap: <FaSitemap />,
  FaProjectDiagram: <FaProjectDiagram />,
  FaUsersCog: <FaUsersCog />,
  FaDatabase: <FaDatabase />,
  FaLanguage: <FaLanguage />,
  FaVolumeUp: <FaVolumeUp />,
  FaSearchPlus: <FaSearchPlus />,
  FaMicrochip: <FaMicrochip />,
  FaPalette: <FaPalette />,
  FaTree: <FaTree />,
  FaStar: <FaStar />,
  FaTools: <FaTools />,
  FaComments: <FaComments />,
  FaLightbulb: <FaLightbulb />,
  FaClipboardCheck: <FaClipboardCheck />,
  FaClock: <FaClock />,
  FaFlask: <FaFlask />,
  FaBalanceScale: <FaBalanceScale />,
  FaShieldAlt: <FaShieldAlt />,
  FaMoneyBillWave: <FaMoneyBillWave />,
  FaRoute: <FaRoute />,
  FaRocket: <FaRocket />,
  FaRoad: <FaRoad />,
  SiRubyonrails: <SiRubyonrails />,
  SiTypescript: <SiTypescript />,
  SiPostgresql: <SiPostgresql />,
  SiMysql: <SiMysql />,
  SiKubernetes: <SiKubernetes />,
  SiGooglecloud: <SiGooglecloud />,
  SiSpringboot: <SiSpringboot />,
  SiPhp: <SiPhp />,
  SiNetlify: <SiNetlify />,
  SiHeroku: <SiHeroku />,
  SiHtml5: <SiHtml5 />,
  SiCss3: <SiCss3 />,
  SiRabbitmq: <SiRabbitmq />,
  SiImessage: <SiImessage />,
  SiJavascript: <SiJavascript />,
  SiC: <SiC />,
  SiCplusplus: <SiCplusplus />,
  SiGrafana: <SiGrafana />,
  SiDvc: <SiDvc />,
  SiMicrosoftazure: <SiMicrosoftazure />,
  SiMongodb: <SiMongodb />,
  SiFastapi: <SiFastapi />,
  SiDjango: <SiDjango />,
  SiFlask: <SiFlask />,
  SiPlaywright: <SiPlaywright />,
  SiPytest: <SiPytest />,
  SiPytorch: <SiPytorch />,
  SiTensorflow: <SiTensorflow />,
  SiOpenai: <SiOpenai />,
  SiPowerbi: <SiPowerbi />,
};

const Skills: React.FC = () => {
  const [skillsData, setSkillsData] = useState<Skill[]>([]);

  useEffect(() => {
    async function fetchSkills() {
      const data = await getSkills();
      setSkillsData(data);
    }

    fetchSkills();
  }, []);

  if (skillsData.length === 0) return <div>Loading...</div>;

  const skillsByCategory = skillsData.reduce((acc: Record<string, Skill[]>, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryOrder = ['Technical Skills', 'Soft Skills', 'Domain Expertise'];
  const categories = Object.keys(skillsByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="skills-container">
      <div className="skills-hero">
        <img src={skillsSoftHard} alt="Soft and hard skills cubes" />
        <div className="skills-hero-overlay">
          <span className="skills-hero-tagline">Technical | Soft | Domain Mastery</span>
        </div>
      </div>
      <h2 className="skills-title">Stacks I Build With</h2>
      {categories.map((category, index) => (
        <div key={category} className="skill-category">
          <h3 className="category-title">{category}</h3>
          <div className="skills-grid">
            {skillsByCategory[category].map((skill, idx) => (
              <div key={idx} className="skill-card">
                <div className="icon">{iconMap[skill.icon] || <FaReact />}</div>
                <h3 className="skill-name">
                  {skill.name.split('').map((letter, i) => (
                    <span key={i} className="letter" style={{ animationDelay: `${i * 0.04}s` }}>
                      {letter}
                    </span>
                  ))}
                </h3>
                <p className="skill-description">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skills;
