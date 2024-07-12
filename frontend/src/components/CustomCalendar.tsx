// Calendar.tsx
import React from "react";
import { Calendar } from "@natscale/react-calendar";
import "@natscale/react-calendar/dist/main.css";
import "../css/CustomCalendar.css";

const CustomCalendar: React.FC = () => {
  const date = new Date();
  const today = new Date();
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const range = lastDayOfMonth.getDate() - today.getDate();

  const value = [today, lastDayOfMonth];
  return (
    <div
      className="calendar-container custom-calendar justify-center md:flex hidden"
      style={{ width: "100%" }}
    >
      <Calendar fixedRange={range} isRangeSelector value={value} size={360} />
    </div>
  );
};

export default CustomCalendar;
