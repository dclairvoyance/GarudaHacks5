import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import TaskDetailModal from "../components/TaskDetailsModal";
import Upload from "../components/Upload";
import UploadModal from "../components/UploadModal";
import CustomCalendar from "../components/CustomCalendar";
import Reminder from "../components/Reminder";

interface Task {
  id: number;
  name: string;
  checked: boolean;
}

const TrackerComponent: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<any[]>([]);
  const information = "Ternate"; // TODO: change information from tektokan

  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    "January 2024": [
      {
        id: 1,
        name: "Daily 15 minutes of English Speaking Practice",
        checked: false,
      },
      {
        id: 2,
        name: "Start collecting School Certificates and Report Cards",
        checked: false,
      },
    ],
    "February 2024": [
      { id: 3, name: "Task 3", checked: false },
      { id: 4, name: "Task 4", checked: false },
      { id: 5, name: "Task 5", checked: false },
    ],
    // Add more months and tasks as needed
  });

  const [openMonth, setOpenMonth] = useState<string | null>(null);
  const [showModalTaskDetail, setShowModalTaskDetail] = useState(false);
  const [showModalUpload, setShowModalUpload] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const transformData = (data: any[]) => {
    const result: Record<string, Task[]> = {};

    data.forEach((item, index) => {
      const tasksArray = item.tasks
        .split(";")
        .map((task: string, taskIndex: number) => ({
          id: index * 100 + taskIndex + 1,
          name: task.trim(),
          checked: false,
        }));

      result[item.month] = tasksArray;
    });

    return result;
  };

  const handleMonthClick = (month: string) => {
    setOpenMonth(openMonth === month ? null : month); // Toggle dropdown visibility
    setSelectedMonth(month);
  };

  const handleTaskChange = (month: string, taskId: number) => {
    const updatedTasks = tasks[month].map((task) =>
      task.id === taskId ? { ...task, checked: !task.checked } : task
    );
    setTasks((prev) => ({ ...prev, [month]: updatedTasks }));
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
              content: `Buatkan tracker bulanan untuk persiapan beasiswa GKS dari sekarang kelas 10 semester 1 sampai kelas 12 semester 2.
                 Kondisi saat ini, saya tinggal di ${information}, membutuhkan beasiswa, nilai rapor saya rata-rata 95, dan belum mahir berbahasa inggris.
                 Usahakan tracker mengandung nilai kuantitatif, contoh membaca buku The Official Academic Guide to IELTS halaman 1-10. 
                 Detailkan pula setiap dokumen syarat pendaftaran. 
                 Buatlah dalam format csv dengan header: 'month (bulan, dari bulan ini)' dan 'tasks' (daftar tugas dengan knilai kuantitatif, pisahkan dengan titik koma).
                 Hilangkan pembuka dan penutup. Gunakan bahasa Inggris.`, // TODO: change information from tektokan
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

      const formattedCSVContent = csvContent.replace(
        /(".*?")/g,
        (match: string) => {
          return match.replace(/,/g, ";");
        }
      );

      const parsedData = Papa.parse(formattedCSVContent, {
        header: true,
        skipEmptyLines: true,
      });
      const transformedData = transformData(parsedData.data);
      setTasks(transformedData);
      console.log("Generated CSV data:", transformedData);
      setJsonData(parsedData.data);
      console.log("parsedData.data:", parsedData.data);
    } catch (error) {
      console.error("Error generating CSV:", error);
    }
  };

  const handleUpload = () => {
    try {
      console.log();
    } catch (error) {
      console.log("Error uploading CSV:", error);
    }
  };

  return (
    <div
      className="relative flex w-full items-center justify-between h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('./BG2.svg')" }}
    >
      <div className="p-6 w-[50%] my-auto">
        <CustomCalendar />
        <Reminder remainingDays={5} remainingTasks={3} />
      </div>
      <div className="p-6 w-[50%] bg-[#ffffff] shadow-lg rounded-lg h-screen">
        <h1
          className="text-3xl font-extrabold text-center mb-6"
          style={{ color: "#0b7b71" }}
        >
          Monthly Tracker
        </h1>
        <div className="relative h-[75vh] overflow-y-auto bg-white p-4 rounded-lg shadow-md scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-[#f8e4ad] scrollbar-track-gray-50">
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
                              onChange={() => handleTaskChange(month, task.id)}
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
        <button
          onClick={handleGenerateTracker}
          className="w-full p-3 mt-6 bg-[#0b7b71] text-white rounded-lg hover:bg-[#055851] transition-colors"
        >
          Generate CSV
        </button>
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
  );
};

export default TrackerComponent;
