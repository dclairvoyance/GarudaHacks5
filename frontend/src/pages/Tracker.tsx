import React, { useState } from 'react';

const TrackerComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [tasks, setTasks] = useState({
    'January 2024': [
      { id: 1, name: 'Task 1', checked: false },
      { id: 2, name: 'Task 2', checked: false }
    ],
    'February 2024': [
      { id: 3, name: 'Task 3', checked: false },
      { id: 4, name: 'Task 4', checked: false },
      { id: 5, name: 'Task 5', checked: false }
    ]
    // Add more months and tasks as needed
  });

  const [openMonth, setOpenMonth] = useState(null);

  const handleMonthClick = (month) => {
    setOpenMonth(openMonth === month ? null : month); // Toggle dropdown visibility
    setSelectedMonth(month);
  };

  const handleTaskChange = (month, taskId) => {
    const updatedTasks = tasks[month].map(task =>
      task.id === taskId ? { ...task, checked: !task.checked } : task
    );
    setTasks(prev => ({ ...prev, [month]: updatedTasks }));
  };

  const calculateProgress = (month) => {
    const taskList = tasks[month] || [];
    const totalTasks = taskList.length;
    const completedTasks = taskList.filter(task => task.checked).length;
    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  };

  const getProgressText = (month) => {
    const taskList = tasks[month] || [];
    const totalTasks = taskList.length;
    const completedTasks = taskList.filter(task => task.checked).length;
    return `${completedTasks}/${totalTasks}`;
  };

  const isAllTasksChecked = (month) => {
    const taskList = tasks[month] || [];
    return taskList.length > 0 && taskList.every(task => task.checked);
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

  return (
    <div className="p-6 w-9/12 mx-auto">
      <h1 className="text-2xl font-bold mb-4">ToDo Progress</h1>
      <div className="relative">
        <div className="bg-gray-200 p-4 rounded shadow-md">
          {Object.keys(tasks).map(month => (
            <div key={month} className="mb-2">
              <button
                className={`w-full text-left px-4 py-2 rounded flex items-center justify-between ${openMonth === month ? 'bg-gray-300' : 'bg-gray-200'} focus:outline-none`}
                onClick={() => handleMonthClick(month)}
              >
                <div className="flex items-center">
                  {renderProgressCircle(calculateProgress(month))}
                  <span className="font-semibold">{month}</span>
                </div>
                <span className="ml-2 text-gray-600">{getProgressText(month)}</span>
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
                    {tasks[month].map(task => (
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
    </div>
  );
};

export default TrackerComponent;
