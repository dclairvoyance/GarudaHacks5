import React from "react";
import { CalendarIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Lottie from "lottie-react";
import progressAnimation from "../assets/lottie/Progress.json";

interface ReminderProps {
  remainingDays: number;
  remainingTasks: number;
}

const Reminder: React.FC<ReminderProps> = ({
  remainingDays,
  remainingTasks,
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="w-64 h-64 mr-4 flex">
        <Lottie animationData={progressAnimation} loop={true} />
      </div>
      <div className="bg-blue-100 p-4 mt-4 rounded-lg shadow-lg flex items-center">
        <CalendarIcon className="text-blue-500 h-6 w-6 mr-2" />
        <CheckCircleIcon className="text-green-500 h-6 w-6 mr-2" />
        <span className="text-lg font-semibold">
          {remainingDays} {remainingDays === 1 ? "day" : "days"} left and{" "}
          {remainingTasks} {remainingTasks === 1 ? "task" : "tasks"} to go! You
          got this!
        </span>
      </div>
    </div>
  );
};

export default Reminder;
