"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const MyFullCalendar: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content relative">
          <div id="fullCalendar">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={[
                { title: "Web Development Seminar", date: "2025-02-04" },
                { title: "Web Development Seminar", date: "2025-02-10" },
                { title: "Web Development Seminar", date: "2025-02-15" },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyFullCalendar;
