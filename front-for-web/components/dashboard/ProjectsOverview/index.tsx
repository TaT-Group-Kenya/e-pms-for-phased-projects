"use client";

import React from "react";
import TotalProjects from "./TotalProjects";
import ActiveProjects from "./ActiveProjects";
import FinishedProjects from "./FinishedProjects";
import TeamMembers from "./TeamMembers";

const ProjectsOverview: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Projects Overview</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[25px]">
            <div>
              <TotalProjects />
            </div>

            <div>
              <ActiveProjects />
            </div>

            <div>
              <FinishedProjects />
            </div>

            <div>
              <TeamMembers />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsOverview;
