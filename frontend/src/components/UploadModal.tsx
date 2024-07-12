import React, { useEffect, useState, useRef } from "react";
import Upload from "./Upload";
import { toast } from "react-hot-toast";

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
  const [imageSrc, setImageSrc] = useState<string>("");
  const [error, setError] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);


  const handleFileUpload = (file: Blob) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        setImageSrc(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const loadingToast = toast.loading("Loading...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const isSuccess = task!.id % 2 == 0;

      if (isSuccess) {
        toast.success("Proof verified!", {
          id: loadingToast,
        });
        onClose();
      } else {
        setError("You only do 5 from 10 questions!")
        throw new Error("Proof invalid!");
      }
    } catch (error) {
      toast.error("Proof invalid!", {
        id: loadingToast,
      });
    }
  };

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
          <h3 className="text-lg font-semibold">Upload Proof</h3>
          <button onClick={onClose} className="text-black text-2xl">
            &times;
          </button>
        </div>
        <div className="p-4 text-gray-700 h-full overflow-y-auto hide-scrollbar">
          <div className="text-md font-bold mb-0.5">Task: </div>
          <div className="text-sm font-medium mb-2">{task?.name}</div>
          <div className="text-md font-bold mb-1">Upload: </div>
          <Upload onFileUpload={handleFileUpload} />
          {imageSrc ? (
            <div className="rounded-md border-dashed border-2 border-[#d1d5db] mt-2 flex justify-center items-center">
              <img
                src={imageSrc}
                alt="Uploaded"
                className="rounded-md max-h-80 w-auto"
              />
            </div>
          ) : (
            <div className="h-8 rounded-md border-dashed border-2 border-[#d1d5db] mt-2"></div>
          )}
          {error ? <div className="text-md font-bold mb-0.5 text-center text-red-500">{error}</div> : <></>}
        </div>

        <div className="border-t px-4 py-2 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-[#0b7b71] text-white px-4 py-2 rounded hover:bg-[#055851]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
