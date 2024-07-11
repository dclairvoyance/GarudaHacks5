import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

const TrackerComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  const [jsonData, setJsonData] = useState<any[]>([]);
  const information = "Ternate"; // TODO: change information from tektokan

  const [tasks, setTasks] = useState({
    "January 2024": [
      { id: 1, name: "Task 1", checked: false },
      { id: 2, name: "Task 2", checked: false },
    ],
    "February 2024": [
      { id: 3, name: "Task 3", checked: false },
      { id: 4, name: "Task 4", checked: false },
      { id: 5, name: "Task 5", checked: false },
    ],
    // Add more months and tasks as needed
  });

  function transformData(data) {
    const result = {};
  
    data.forEach((item, index) => {
      const tasksArray = item.tasks.split(';').map((task, taskIndex) => ({
        id: index * 100 + taskIndex + 1,
        name: task.trim(),
        checked: false,
      }));
  
      result[item.month] = tasksArray;
    });
  
    return result;
  }

  const [openMonth, setOpenMonth] = useState(null);

  const handleMonthClick = (month) => {
    setOpenMonth(openMonth === month ? null : month); // Toggle dropdown visibility
    setSelectedMonth(month);
  };

  const handleTaskChange = (month, taskId) => {
    const updatedTasks = tasks[month].map((task) =>
      task.id === taskId ? { ...task, checked: !task.checked } : task
    );
    setTasks((prev) => ({ ...prev, [month]: updatedTasks }));
  };

  const calculateProgress = (month) => {
    const taskList = tasks[month] || [];
    const totalTasks = taskList.length;
    const completedTasks = taskList.filter((task) => task.checked).length;
    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  };

  const getProgressText = (month) => {
    const taskList = tasks[month] || [];
    const totalTasks = taskList.length;
    const completedTasks = taskList.filter((task) => task.checked).length;
    return `${completedTasks}/${totalTasks}`;
  };

  const isAllTasksChecked = (month) => {
    const taskList = tasks[month] || [];
    return taskList.length > 0 && taskList.every((task) => task.checked);
  };

  const renderProgressCircle = (percentage) => {
    const radius = 10;
    const strokeWidth = 3;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <svg width="24" height="24" viewBox="0 0 24 24" className="mr-2">
        {percentage === 100 ? (
          <path
            d="M5 13l4 4L19 7"
            stroke="green"
            strokeWidth="2"
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
              stroke="blue"
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
      setJsonData(parsedData.data);
    } catch (error) {
      console.error("Error generating CSV:", error);
    }
  };

  return (
    <div className="p-6 w-9/12 mx-auto">
      <h1 className="text-2xl font-bold mb-4">ToDo Progress</h1>
      <div className="relative">
        <div className="bg-gray-200 p-4 rounded shadow-md">
          {Object.keys(tasks).map((month) => (
            <div key={month} className="mb-2">
              <button
                className={`w-full text-left px-4 py-2 rounded flex items-center justify-between ${
                  openMonth === month ? "bg-gray-300" : "bg-gray-200"
                } focus:outline-none`}
                onClick={() => handleMonthClick(month)}
              >
                <div className="flex items-center">
                  {renderProgressCircle(calculateProgress(month))}
                  <span className="font-semibold">{month}</span>
                </div>
                <span className="ml-2 text-gray-600">
                  {getProgressText(month)}
                </span>
              </button>
              {openMonth === month && (
                <div className="mt-2 pl-4">
                  <div className="relative mb-4">
                    <div className="bg-gray-200 h-4 rounded mr-16">
                      <div
                        className="bg-blue-500 h-4 rounded"
                        style={{ width: `${calculateProgress(month)}%` }}
                      />
                    </div>
                    <span className="absolute top-0 right-0 text-xs text-blue-500">
                      {Math.round(calculateProgress(month))}%
                    </span>
                  </div>
                  <ul>
                    {tasks[month].map((task) => (
                      <li key={task.id} className="mb-2 flex items-center">
                        <input
                          type="checkbox"
                          checked={task.checked}
                          onChange={() => handleTaskChange(month, task.id)}
                          className="mr-2"
                        />
                        <span>{task.name}</span>
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
        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors0"
      >
        Generate CSV
      </button>
    </div>
  );
};

export default TrackerComponent;
