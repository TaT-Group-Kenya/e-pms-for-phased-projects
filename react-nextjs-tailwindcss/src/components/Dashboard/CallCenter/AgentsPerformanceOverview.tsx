"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Agent {
  name: string;
  image: string;
  calls: number;
  avgDuration: string;
  fcr: number;
  csat: number;
}

const AgentsPerformanceOverview: React.FC = () => {
  const [topAgent, setTopAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        topAgent: {
          name: "John Smith",
          image: "/images/users/user61.jpg",
          calls: 380,
          avgDuration: "4 mins 10 secs",
          fcr: 85,
          csat: 92,
        },
        agents: [
          {
            name: "Sarah Davis",
            image: "/images/users/user62.jpg",
            calls: 65,
            avgDuration: "4 mins 10 secs",
            fcr: 85,
            csat: 90,
          },
          {
            name: "Michael Brown",
            image: "/images/users/user63.jpg",
            calls: 58,
            avgDuration: "5 mins 20 secs",
            fcr: 82,
            csat: 87,
          },
          {
            name: "Emily Johnson",
            image: "/images/users/user64.jpg",
            calls: 72,
            avgDuration: "4 mins 30 secs",
            fcr: 88,
            csat: 90,
          },
          {
            name: "David Lee",
            image: "/images/users/user65.jpg",
            calls: 53,
            avgDuration: "3 mins 50 secs",
            fcr: 80,
            csat: 85,
          },
        ],
      };
      setTopAgent(data.topAgent);
      setAgents(data.agents);
    };
    fetchData();
  }, []);

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0 !font-semibold">Agents Performance Overview</h5>
        </div>
      </div>
      <div className="trezo-card-content">
        <span className="block mb-[10px]">Top Performing Agent</span>
        {topAgent && (
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="flex items-center gap-[10px]">
                <Image
                  src={topAgent.image}
                  width={40}
                  height={40}
                  className="rounded-[4px]"
                  alt="user-image"
                />
                <div className="relative">
                  <span className="font-semibold text-gray-700 dark:text-white block">
                    {topAgent.name}
                  </span>
                  <span className="block -mt-px text-gray-700 dark:text-gray-400">
                    {topAgent.calls} Calls
                  </span>
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 ltr:-left-[14px] rtl:-right-[14px] w-[8px] h-[8px] rounded-full ${
                      topAgent.csat >= 90 ? "bg-success-500" : "bg-orange-500"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="ltr:md:pl-[45px] rtl:md:pr-[45px] mt-[10px] md:mt-0">
                <div className="flex items-center justify-between mb-[5px]">
                  <span className="block">Customer Satisfaction (CSAT)</span>
                  <span className="block">{topAgent.csat}%</span>
                </div>
                <div className="flex w-full h-[6px] overflow-hidden rounded-md bg-gray-100 dark:bg-[#172036]">
                  <div
                    className="flex flex-col justify-center overflow-hidden bg-success-600 rounded-md"
                    style={{ width: `${topAgent.csat}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="table-responsive overflow-x-auto mt-[15px] md:mt-[20px]">
          <table className="w-full">
            <tbody className="text-black dark:text-white">
              {agents.map((agent, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap py-[8px] px-[9px] bg-gray-50 dark:bg-[#0a0e19] border-none ltr:first:rounded-l-md rtl:first:rounded-r-md ltr:last:rounded-r-md rtl:last:rounded-l-md">
                      <div className="flex items-center gap-[10px]">
                        <Image
                          src={agent.image}
                          width={36}
                          height={36}
                          className="rounded-[4px]"
                          alt="user-image"
                        />
                        <div className="relative">
                          <span className="font-medium text-gray-700 dark:text-white block">
                            {agent.name}
                          </span>
                          <span className="block -mt-px text-gray-700 dark:text-gray-400">
                            {agent.calls} Calls
                          </span>
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 ltr:-left-[14px] rtl:-right-[14px] w-[8px] h-[8px] rounded-full ${
                              agent.csat >= 90 ? "bg-success-500" : "bg-orange-500"
                            }`}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap py-[8px] px-[9px] bg-gray-50 dark:bg-[#0a0e19] border-none ltr:first:rounded-l-md rtl:first:rounded-r-md ltr:last:rounded-r-md rtl:last:rounded-l-md">
                      <span className="block text-gray-500 dark:text-gray-400">
                        Avg. Call Duration
                      </span>
                      <span className="font-medium text-gray-700 dark:text-white">
                        {agent.avgDuration}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap py-[8px] px-[9px] bg-gray-50 dark:bg-[#0a0e19] border-none ltr:first:rounded-l-md rtl:first:rounded-r-md ltr:last:rounded-r-md rtl:last:rounded-l-md">
                      <span className="block text-gray-500 dark:text-gray-400">
                        FCR
                      </span>
                      <span className="font-medium text-gray-700 dark:text-white">
                        {agent.fcr}%
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap py-[8px] px-[9px] bg-gray-50 dark:bg-[#0a0e19] border-none ltr:first:rounded-l-md rtl:first:rounded-r-md ltr:last:rounded-r-md rtl:last:rounded-l-md">
                      <span className="block text-gray-500 dark:text-gray-400">
                        CSAT
                      </span>
                      <span className="font-medium text-gray-700 dark:text-white">
                        {agent.csat}%
                      </span>
                    </td>
                  </tr>
                  {index < agents.length - 1 && (
                    <tr>
                      <td className="p-[5px]"></td>
                      <td className="p-[5px]"></td>
                      <td className="p-[5px]"></td>
                      <td className="p-[5px]"></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentsPerformanceOverview;