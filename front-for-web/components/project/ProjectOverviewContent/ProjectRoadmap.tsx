"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ProjectPhase {
  id: number;
  name: string;
  progress_percentage?: number;
  status?: string;
}

interface ProjectDetailsData {
  id: number;
  name: string;
  no_of_phases?: number;
  progress?: number;
  phases?: ProjectPhase[];
}

interface ProjectRoadmapProps {
  project?: ProjectDetailsData | null;
}

const ProjectRoadmap: React.FC<ProjectRoadmapProps> = ({ project }) => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);
  const [seriesData, setSeriesData] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setChartLoaded(true);

    if (!project) {
      setCategories([]);
      setSeriesData([]);
      return;
    }

    // Use actual phases from API if available
    if (project.phases && project.phases.length > 0) {
      const phaseNames = project.phases.map(phase => phase.name);
      const progressData = project.phases.map(phase => phase.progress_percentage || 0);
      
      setCategories(phaseNames);
      setSeriesData(progressData);
    } else {
      // Fallback: generate based on no_of_phases count
      const phases = project.no_of_phases || 5;
      const phaseNames = [];
      const progressData = [];
      const overallProgress = project.progress || 0;
      const progressPerPhase = Math.floor(overallProgress / phases);

      for (let i = 1; i <= phases; i++) {
        phaseNames.push(`Phase ${i}`);
        // Distribute progress across phases
        progressData.push(Math.min(progressPerPhase * i, 100));
      }

      setCategories(phaseNames);
      setSeriesData(progressData);
    }
  }, [project]);

  const series = [
    {
      name: "Progress %",
      data: seriesData.length > 0 ? seriesData : [0],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#3584FC"],
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories.length > 0 ? categories : ["Phase 1"],
      axisTicks: {
        show: true,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: true,
        color: "#ECEEF2",
      },
      labels: {
        show: true,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: true,
        color: "#ECEEF2",
      },
      axisTicks: {
        show: true,
        color: "#ECEEF2",
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Project Roadmap</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="-mt-[26px] -mb-[25px] ltr:-ml-[10px] rtl:-mr-[10px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={342}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectRoadmap;
