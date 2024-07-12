import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Upload from "./Upload";

interface Task {
  id: number;
  name: string;
  checked: boolean;
}

interface UploadModalProps {
  show: boolean;
  onClose: () => void;
  task: Task | null;
}

const UploadModal: React.FC<UploadModalProps> = ({ show, onClose, task }) => {
  const [verdict, serVerdict] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     if (show && task) {
  //       const fetchVerdict = async () => {
  //         try {
  //           const response = await axios.post(
  //             "https://api.openai.com/v1/chat/completions",
  //             {
  //               model: "gpt-4",
  //               messages: [
  //                 {
  //                   role: "user",
  //                   content: `Please look at the image and see if the ${task.name} task is considered completed or not based on the image`,
  //                 },
  //               ],
  //             },
  //             {
  //               headers: {
  //                 "Content-Type": "application/json",
  //                 Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  //               },
  //             }
  //           );

  //           const content = response.data.choices[0].message.content;
  //           setVerdict(content);
  //         } catch (error) {
  //           console.error("Error fetching verdict:", error);
  //         }
  //       };

  //       fetchVerdict();
  //     }
  //   }, [show, task]);

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

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-2xl"
        style={{ minWidth: "70vw" }}
      >
        <div className="border-b px-4 py-2 flex justify-between items-center">
          <h3 className="text-lg font-semibold">{task?.name}</h3>
          <button onClick={onClose} className="text-black text-2xl">
            &times;
          </button>
        </div>
        <div className="p-4 space-y-4 text-gray-700">
          <Upload />
          <p className="whitespace-pre-wrap">Ini harusnya</p>
        </div>
        <div className="border-t px-4 py-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
