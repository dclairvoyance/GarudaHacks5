import React, { useState } from 'react';

const TrackerComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [tasks, setTasks] = useState({
    January: [
      { id: 1, name: 'Task 1', checked: false },
      { id: 2, name: 'Task 2', checked: false }
    ],
    February: [
      { id: 3, name: 'Task 3', checked: false },
      { id: 4, name: 'Task 4', checked: false }
    ]
    // Add more months and tasks as needed
  });

  const [openMonth, setOpenMonth] = useState(null);

  const handleMonthClick = (month) => {
    if (openMonth === month) {
      setOpenMonth(null); // Close if the same month is clicked
    } else {
      setOpenMonth(month); // Open the new month
      setSelectedMonth(month);
    }
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

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">ToDo Progress</h1>
      <div className="relative">
        <div className="bg-gray-200 p-4 rounded shadow-md">
          <button
            className="w-full bg-gray-800 text-white px-4 py-2 rounded mb-4 text-left"
            onClick={() => handleMonthClick(null)}
          >
            {selectedMonth || 'Select a Month'}
          </button>
          {Object.keys(tasks).map(month => (
            <div key={month} className="mb-2">
              <button
                className={`w-full text-left px-4 py-2 rounded ${openMonth === month ? 'bg-gray-300' : 'bg-gray-200'} focus:outline-none`}
                onClick={() => handleMonthClick(month)}
              >
                {month}
              </button>
              {openMonth === month && (
                <div className="mt-2 pl-4">
                  <div className="relative">
                    <div className="bg-gray-200 h-4 rounded">
                      <div
                        className="bg-blue-500 h-4 rounded"
                        style={{ width: `${calculateProgress(month)}%` }}
                      />
                    </div>
                    <span className="absolute top-0 right-0 text-xs text-blue-500">
                      {Math.round(calculateProgress(month))}%
                    </span>
                  </div>
                  <ul className="mt-2">
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
