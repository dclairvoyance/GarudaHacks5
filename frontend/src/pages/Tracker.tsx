import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import TaskDetailModal from "../components/TaskDetailsModal";
import UploadModal from "../components/UploadModal";
import CustomCalendar from "../components/CustomCalendar";
import Reminder from "../components/Reminder";
import Navbar from "../components/Navbar";

interface Task {
  id: number;
  name: string;
  checked: boolean;
}

const TrackerComponent: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const information = localStorage.getItem("data") || "";

  const [tasks, setTasks] = useState<Record<string, Task[]>>({});

  const [openMonth, setOpenMonth] = useState<string | null>(null);
  const [showModalTaskDetail, setShowModalTaskDetail] = useState(false);
  const [showModalUpload, setShowModalUpload] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleMonthClick = (month: string) => {
    setOpenMonth(openMonth === month ? null : month); // Toggle dropdown visibility
    setSelectedMonth(month);
  };

  // const handleTaskChange = (month: string, taskId: number) => {
  //   const updatedTasks = tasks[month].map((task) =>
  //     task.id === taskId ? { ...task, checked: !task.checked } : task
  //   );
  //   setTasks((prev) => ({ ...prev, [month]: updatedTasks }));
  // };

  const daysLeftInMonth = (date) => {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = date.getDate();

    return lastDayOfMonth - currentDay;
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowModalTaskDetail(true);
  };

  const handleUploadClick = (task: Task) => {
    setSelectedTask(task);
    setShowModalUpload(true);
  };

  const calculateProgress = (month: string) => {
    const taskList = tasks[month] || [];
    const totalTasks = taskList.length;
    const completedTasks = taskList.filter((task) => task.checked).length;
    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  };

  const getProgressText = (month: string) => {
    const taskList = tasks[month] || [];
    const totalTasks = taskList.length;
    const completedTasks = taskList.filter((task) => task.checked).length;
    return `${completedTasks}/${totalTasks}`;
  };

  const renderProgressCircle = (percentage: number) => {
    const radius = 9;
    const strokeWidth = 4;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <svg width="24" height="24" viewBox="0 0 24 24" className="mr-2">
        {percentage === 100 ? (
          <path
            d="M5 13l4 4L19 7"
            stroke="green"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <>
            <circle
              cx="12"
              cy="12"
              r={radius}
              stroke="gray"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx="12"
              cy="12"
              r={radius}
              stroke="#0b7b71"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    );
  };

  const handleGenerateTracker = async () => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: `
                Informasi saya ialah sebagai berikut ${information}. Buatkan tracker bulanan untuk persiapan beasiswa yang dipilih dari bulan ini (juli 2024) sampai kelas 12 semester 2. Anda tidak akan menerima informasi lebih lanjut, jadi cukup buatkan langsung trackernya. 
                Jangan gunakan kata pengatar apapun, hanya keluarkan csv nya saja. Usahakan tracker mengandung nilai kuantitatif dan terdapat evaluasi yang kuantitatif, contoh membaca buku The Official Academic Guide to IELTS halaman 1-10 dan mengerjakan soal latihan halaman 19 - 20 sebanyak 30 soal dan harus benar minimal 80%. 
                Detailkan pula setiap dokumen syarat pendaftaran beasiswa dan/atau pendaftaran universitas. 
                Buatlah dalam format csv dengan header: 'month (dari bulan ini)' dan 'tasks' (yaitu daftar tugas dengan nilai kuantitatif, pisahkan setiap tugas dengan titik koma, jangan gunakan koma). 
                Gunakan bahasa Inggris.`,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const csvContent = response.data.choices[0].message.content;

      const lines = csvContent.trim().split("\n").slice(2);
      const tasksByMonth = {};

      lines.forEach((line, index) => {
        const [month, tasks] = line.split(/,(.+)/);
        if (month && tasks) {
          tasksByMonth[month.trim()] = tasks.split(";").map((task, i) => ({
            id: index * 10 + i + 1,
            name: task.trim(),
            checked: false,
          }));
          console.log(tasksByMonth[month.trim()]);
        }
      });
      setTasks(tasksByMonth);
    } catch (error) {
      console.error("Error generating CSV:", error);
    }
  };

  const countUncheckedTasksInFirstMonth = (tasks) => {
    const months = Object.keys(tasks);
    if (months.length === 0) return 0;
    const firstMonth = months[0];
    return tasks[firstMonth].filter((task) => !task.checked).length;
  };

  useEffect(() => {
    if (information) {
      handleGenerateTracker();
    }
  }, [information]);

  return (
    <>
      <Navbar hidden />
      <div
        className="relative flex flex-col md:flex-row w-full items-center justify-between h-screen bg-cover bg-center -mt-16"
        style={{ backgroundImage: "url('./BG2.svg')" }}
      >
        <div className="p-6 w-full md:w-[50%] my-auto">
          <CustomCalendar />
          <Reminder
            remainingDays={daysLeftInMonth(new Date())}
            remainingTasks={countUncheckedTasksInFirstMonth(tasks)}
          />
        </div>
        <div className="p-6 w-full md:w-[50%] bg-[#ffffff] shadow-lg rounded-lg h-[85vh]">
          <div className="flex flex-col mt-auto h-full justify-center">
            <h1
              className="text-3xl font-extrabold text-center mb-6"
              style={{ color: "#0b7b71" }}
            >
              Tracker Pal
            </h1>
            <div className="relative h-full overflow-y-auto bg-white p-4 rounded-lg shadow-md scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-[#f8e4ad] scrollbar-track-gray-50">
              <div className="bg-white p-6">
                {Object.keys(tasks).map((month) => (
                  <div key={month} className="mb-4">
                    <button
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${
                        openMonth === month ? "bg-[#FFF0C8]" : "bg-white"
                      } hover:bg-[#f8e4ad] focus:outline-none`}
                      onClick={() => handleMonthClick(month)}
                    >
                      <div className="flex items-center">
                        {renderProgressCircle(calculateProgress(month))}
                        <span className="font-semibold text-gray-800 ml-2">
                          {month}
                        </span>
                      </div>
                      <span className="ml-2 text-gray-600">
                        {getProgressText(month)}
                      </span>
                    </button>
                    {openMonth === month && (
                      <div className="mt-3 px-4">
                        <div className="relative mb-4">
                          <div className="bg-gray-300 h-5 rounded-full overflow-hidden">
                            <div
                              className="h-5 rounded-full"
                              style={{
                                background: "#0b7b71",
                                width: `${calculateProgress(month)}%`,
                              }}
                            />
                          </div>
                          <div className="absolute flex justify-center w-full top-0.5 text-xs">
                            <div className="bg-[#0b7b71] rounded-sm py-0.25 px-1 text-white">
                              {Math.round(calculateProgress(month))}%
                            </div>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {tasks[month].map((task) => (
                            <li
                              key={task.id}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center gap-x-2">
                                <input
                                  type="checkbox"
                                  checked={task.checked}
                                  // onChange={() => handleTaskChange(month, task.id)}
                                  className="mr-2 rounded border-gray-300 checked:bg-[#0b7b71] focus:ring-[#0b7b71]"
                                />
                                <span
                                  onClick={() => handleTaskClick(task)}
                                  className="cursor-pointer"
                                >
                                  {task.name}
                                </span>
                              </div>
                              <button onClick={() => handleUploadClick(task)}>
                                <svg
                                  className="w-6 h-6 text-black"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 20 16"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                  />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <TaskDetailModal
          show={showModalTaskDetail}
          onClose={() => {
            setShowModalTaskDetail(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
        />

        <UploadModal
          show={showModalUpload}
          onClose={() => {
            setShowModalUpload(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
        />
      </div>
    </>
  );
};

export default TrackerComponent;
