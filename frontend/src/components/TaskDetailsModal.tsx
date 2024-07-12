import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

interface Task {
  id: number;
  name: string;
  checked: boolean;
}

interface TaskDetailModalProps {
  show: boolean;
  onClose: () => void;
  task: Task | null;
}

interface TaskDetails {
  task: string;
  description: string;
  action_plan: string[];
  important_notes: string[];
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  show,
  onClose,
  task,
}) => {
  const [details, setDetails] = useState<TaskDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o",
            messages: [
              {
                role: "user",
                content: `Anda adalah seorang pengajar untuk murid sekolah menengah atas. Murid tersebut ingin mempelajari 
                   "${task.name}". Tugas anda adalah, buatlah rancangan pembelajaran yang runut. Berikan deskripsi singkat mengenai apa yang harus dia lakukan pada section description. Berikan action plan apa saja langkah-langkah yang harus dia lakukan (maksimal 7 poin, 30 kata) dalam section action plan.
                   Berikan pula sumber pembelajaran yang gratis dan berikan link nya. Jika ada, berikan catatan penting yang perlu diketahui siswa, maksimal sebanyak 3 poin pada action notes. 
                   Ingat, anda adalah guru yang baik, sehingga anda ingin membuat proses pembelajaran menjadi mudah, runut, tetapi tetap lengkap. Berikan dalam bahasa Inggris. 
                   Bagi dalam 3 section, yaitu description, action plan, dan important notes. Jika ada linknya, bungkuslah dalam tag HTML <a></a> dan berikan warna biru dengan tailwind dan href nya adalah link tersebut. Berikan pula target _blank pada tag tersebut.`,
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

        const taskDetails = response.data.choices[0].message.content;

        const parsedDetails: TaskDetails = {
          task: task.name,
          description: "",
          action_plan: [],
          important_notes: [],
        };

        const lines = taskDetails.split("\n");
        let currentKey: keyof Omit<TaskDetails, "task"> | null = null;

        const cleanText = (text: string) => {
          return text.replace(/^[0-9]+\.\s*|^-+\s*|\*+\s*/g, "").trim();
        };

        lines.forEach((line) => {
          if (line.toLowerCase().includes("description")) {
            currentKey = "description";
          } else if (line.toLowerCase().includes("action plan")) {
            currentKey = "action_plan";
          } else if (line.toLowerCase().includes("important notes")) {
            currentKey = "important_notes";
          } else if (currentKey) {
            const cleanedLine = cleanText(line);
            if (cleanedLine) {
              if (currentKey === "description") {
                parsedDetails[currentKey] += cleanedLine + "\n";
              } else {
                parsedDetails[currentKey].push(cleanedLine);
              }
            }
          }
        });
        console.log(parsedDetails); // TODO: delete in prod
        const storedTaskDetails = localStorage.getItem("task-details");
        const taskDetailsArray = storedTaskDetails
          ? JSON.parse(storedTaskDetails)
          : [];
        taskDetailsArray.push({ id: task.id, details: parsedDetails });
        localStorage.setItem("task-details", JSON.stringify(taskDetailsArray));
        setDetails(parsedDetails);
      } catch (error) {
        setDetails({
          task: task.name,
          description: "Error loading details.",
          action_plan: [],
          important_notes: [],
        });
        console.error("Error fetching task details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (show && task) {
      const storedTaskDetails = localStorage.getItem("task-details");
      const taskDetailsArray = storedTaskDetails
        ? JSON.parse(storedTaskDetails)
        : [];
      const taskDetails = taskDetailsArray.find(
        (item: { id: number; details: TaskDetails }) => item.id === task.id
      );
      if (taskDetails) {
        setDetails(taskDetails.details);
        return;
      }
      fetchTaskDetails();
    }
  }, [show, task]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [show, onClose]);

  if (!show) {
    return;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-2xl h-[80vh]"
        style={{ minWidth: "70vw" }}
      >
        <div className="border-b px-4 py-2 flex justify-between items-center">
          <h3 className="text-lg font-semibold">{task?.name}</h3>
          <button onClick={onClose} className="text-black text-2xl">
            &times;
          </button>
        </div>
        {loading ? (
          <div className="flex flex-col gap-y-2 items-center justify-center my-auto h-[75vh]">
            <ClipLoader
              color={"#0b7b71"}
              loading={loading}
              size={40}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <div className="text-green-500">Loading...</div>
          </div>
        ) : (
          <div className="p-4 space-y-4 h-[70vh] overflow-y-auto hide-scrollbar">
            <div className="text-gray-700">
              <h4 className="font-semibold mb-1">Description</h4>
              <p className="whitespace-pre-wrap">{details?.description}</p>
            </div>
            <div className="text-gray-700">
              <h4 className="font-semibold mb-1">Action Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {details?.action_plan.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-[#f8e4ad] rounded-lg shadow-md"
                  >
                    {<div dangerouslySetInnerHTML={{ __html: item }} />}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-gray-700">
              <h4 className="font-semibold mb-1">Important Notes</h4>
              <ul className="list-disc ml-5">
                {details?.important_notes.map((item, index) => (
                  <li key={index}> {<div dangerouslySetInnerHTML={{ __html: item }} />}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailModal;
