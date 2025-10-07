import React, { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { MdOutlineWork as WorkIcon } from 'react-icons/md';
import { IoSchool as SchoolIcon } from 'react-icons/io5';
import { FaStar as StarIcon } from 'react-icons/fa';
import './WorkExperience.css';
import { TimelineItem } from '../types';
import { getTimeline } from '../queries/getTimeline';

const WorkExperience: React.FC = () => {
  const [timeLineData, setTimeLineData] = useState<TimelineItem[] | null>(null);

  useEffect(() => {
    async function fetchTimelineItem() {
      const data = await getTimeline();
      setTimeLineData(data);
    }
    fetchTimelineItem();
  }, []);

  if (!timeLineData) return <div>Loading...</div>;

  return (
    <>
      <div className="timeline-container">
        <h2 className="timeline-title">Work Experience &amp; Education Timeline</h2>
      </div>
      <VerticalTimeline>
        {timeLineData.map((item, index) => {
          const isWork = item.timelineType === 'work';
          return (
            <VerticalTimelineElement
              key={`${item.name}-${index}`}
              className={`vertical-timeline-element--${item.timelineType}`}
              iconStyle={
                isWork
                  ? { background: 'rgba(229, 9, 20, 0.85)', color: '#fff', boxShadow: '0 0 0 4px rgba(229, 9, 20, 0.35)' }
                  : { background: 'rgba(25, 176, 255, 0.8)', color: '#fff', boxShadow: '0 0 0 4px rgba(25, 176, 255, 0.25)' }
              }
              icon={isWork ? <WorkIcon /> : <SchoolIcon />}
            >
              <div>
                <h3 className="vertical-timeline-element-title">
                  {isWork ? item.title : item.name}
                </h3>
                <h4 className="vertical-timeline-element-subtitle">
                  {isWork ? item.name : item.title}
                </h4>
                {item.techStack && isWork && (
                  <p className="vertical-timeline-element-tech">{item.techStack}</p>
                )}
                {Array.isArray(item.summaryPoints) && item.summaryPoints.length > 0 ? (
                  <ul className="vertical-timeline-element-summary">
                    {item.summaryPoints.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="vertical-timeline-element-summary">{item.summaryPoints}</p>
                )}
              </div>
            </VerticalTimelineElement>
          );
        })}
        <VerticalTimelineElement
          iconStyle={{ background: 'rgba(39, 174, 96, 0.85)', color: '#fff' }}
          icon={<StarIcon />}
        />
      </VerticalTimeline>
    </>
  );
};

export default WorkExperience;
