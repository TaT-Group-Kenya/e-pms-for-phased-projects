"use client";

import React, { useMemo } from "react";

interface Activity {
  id: number;
  timestamp: string;
  title: string;
  description: string;
  author: string;
  color: string;
}

interface ProjectDetailsData {
  id: number;
  name: string;
  status?: string;
  progress?: number;
  created_at?: string;
}

interface RecentActivityProps {
  project?: ProjectDetailsData | null;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ project }) => {
  const activities = useMemo<Activity[]>(() => {
    if (!project) {
      return [];
    }

    const projectActivities: Activity[] = [];

    // Generate activities based on project data
    if (project.progress) {
      projectActivities.push({
        id: 1,
        timestamp: "Today",
        title: "Project Progress Update",
        description: `Project is currently at ${project.progress}% completion. The project is making steady progress towards completion.`,
        author: project.name,
        color: "bg-primary-500",
      });
    }

    if (project.status) {
      const statusMessages: { [key: string]: string } = {
        'in progress': 'The project is actively being worked on by the team.',
        'pending': 'The project is awaiting to start and resource allocation.',
        'completed': 'The project has been successfully completed and delivered.',
        'on hold': 'The project has been temporarily paused pending further action.',
      };

      projectActivities.push({
        id: 2,
        timestamp: "2 days ago",
        title: `Project Status: ${project.status}`,
        description: statusMessages[project.status.toLowerCase()] || `Project status is ${project.status}.`,
        author: project.name,
        color: "bg-warning-500",
      });
    }

    if (project.created_at) {
      projectActivities.push({
        id: 3,
        timestamp: "3+ days ago",
        title: "Project Created",
        description: `Project ${project.name} was created and initialized in the system.`,
        author: project.name,
        color: "bg-success-500",
      });
    }

    return projectActivities.length > 0
      ? projectActivities
      : [
          {
            id: 1,
            timestamp: "N/A",
            title: "No Activity",
            description: "No project activity has been recorded yet.",
            author: "System",
            color: "bg-gray-500",
          },
        ];
  }, [project]);

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <h5 className="!mb-0">Recent Activity</h5>
      </div>

      <div className="trezo-card-content pt-[10px] pb-[25px]">
        <div className="relative">
          <span className="block absolute top-0 bottom-0 ltr:left-[6px] rtl:right-[6px] ltr:md:left-[98px] rtl:md:right-[98px] mt-[5px] ltr:border-l rtl:border-r border-dashed border-gray-100 dark:border-[#172036]"></span>

          {activities.map((activity) => (
            <div
              key={activity.id}
              className="relative ltr:pl-[25px] rtl:pr-[25px] ltr:md:pl-[132px] rtl:md:pr-[132px] mb-[25px] md:mb-[30px] last:mb-0"
            >
              <span
                className={`block absolute top-[3px] ltr:left-0 rtl:right-0 ltr:md:left-[93px] rtl:md:right-[93px] w-[12px] h-[12px] rounded-full ${activity.color}`}
              ></span>
              <span className="md:absolute md:top-0 ltr:md:left-[5px] rtl:md:right-[5px] text-sm block mb-[10px] md:mb-0">
                {activity.timestamp}
              </span>
              <span className="mb-[10px] block text-black dark:text-white font-medium">
                {activity.title}
              </span>
              <p className="md:max-w-[500px] text-sm leading-[1.7] mb-[11px]">
                {activity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
