import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import axios from "axios";
import Papa from "papaparse";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";

import Lottie from "lottie-react";
import chatbotAnimation from "../assets/lottie/chatbot.json";

import Navbar from "../components/Navbar";

interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
}

const ChatBot: React.FC = () => {
  const navigate = useNavigate();
  const lastMessageRef = useRef(null);
  const initialPrompt: Message = {
    id: 0,
    role: "user",
    /*     content: `Buatkan tracker bulanan untuk persiapan beasiswa GKS dari sekarang kelas 10 semester 1 sampai kelas 12 semester 2.
                 Kondisi saat ini, saya tinggal di Ternate, membutuhkan beasiswa, nilai rapor saya rata-rata 95, dan belum mahir berbahasa inggris.
                 Usahakan tracker mengandung nilai kuantitatif, contoh membaca buku The Official Academic Guide to IELTS halaman 1-10. 
                 Detailkan pula setiap dokumen syarat pendaftaran. 
                 Buatlah dalam format csv dengan header: 'month (bulan, dari bulan ini)' dan 'tasks' (daftar tugas dengan nilai kuantitatif, pisahkan setiap tugas dengan titik koma, jangan gunakan koma).
                 Hilangkan pembuka dan penutup. Gunakan bahasa Inggris. Hilangkan pembuka dan penutup. Gunakan bahasa Inggris. Jika sudah selesai melakukan generate CSV, cukup keluarkan CSV nya.` */
    content: `
      Anda adalah teman / bestie virtual saya. Anda ingin membantu saya merencanakan studi saya hingga perkuliahan lanjut. 
      Mekanismenya adalah sebagai berikut. Anda akan bertanya ke saya, kemudian saya menjawab, kemudian anda bertanya lagi dan seterusnya. 
      Ingat, hanya satu pertanyaan, kemudian jawaban, kemudian satu pertanyaan lagi. Anda harus menggali informasi lebih lanjut mengenai saya 
      untuk menentukan rencana studi saya yang tepat. Saya ingin, anda menanyai saya, seperti saat ini saya sedang di tingkat mana, minat saya, hal yang biasa saya lakukan di waktu senggang, 
      di manakah saya tinggal, nilai saya, dan lain sebagainya. Anda harus berkekspetasi saya berasal dari daerah 3T (terluar, tertinggal, terdepan) yang kekurangan akses informasi. 
      Sebagai contoh, misalkan saya sering mengoprek remote TV, mungkin saya cocok di jurusan elektro dan lain sebagainya. 
      Anda harus terus menggali informasi tentang saya hingga seluruh informasi yang diperlukan terkumpul. Setelah semua informasi terkumpul, inilah yang harus Anda lakukan:
      1. Berikan daftar universitas dan jurusan yang mungkin bisa jalani. Pastikan bahwa jurusan yang disarankan realistis. 
         Jika universitas dan jurusan yang disarankan berada di luar negeri, berikan pula saran beasiswa yang bisa diambil. 
         Cukup berikan maksimal 5 saran untuk univ luar negeri dan 5 saran untuk univ dalam negeri. 
         Prioritaskan universitas dan jurusan yang memiliki beasiswa, dan prioritaskan universitas luar negeri. (1 bubble Anda)
      2. Setelah diberikan list, saya akan memilih satu dari 5 saran tersebut. Jika saya tidak puas, saya akan memilih untuk mencarikan jurusan dan universitas lain. (1 bubble saya)
      3. Setelah itu, berikan pula contoh pekerjaan dari jurusan tersebut dan ekspektasi gajinya dalam indonesia rupiah. Akhiri dengan "BrightBestie". (1 bubble Anda)
      Gunakan bahasa Inggris dan gunakan bahasa informal, seperti seseorang yang curhat ke bestienya. 
      Gunakan bahasa gaul seperti gyatt skibidi delulu. Gunakan emoticon sehingga lebih ramah, tapi jangan berlebihan. `,
    // TODO: add prompt
  };

  const initialMessage: Message = {
    id: 1,
    role: "assistant",
    content:
      "Hello! I can help you plan your study path all the way up to college and beyond! Let's start by gathering some info about you. First question: What grade are you currently in? 😊🎓?",
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState<string>("");
  const [canEnd, setCanEnd] = useState<boolean>(false);

  const [textareaRows, setTextareaRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const lineHeight = 24;
    const minRows = 1;
    const maxRows = 4;

    const textarea = textareaRef.current!;
    const previousRows = textarea.rows;
    textarea.rows = minRows;

    const currentRows = Math.floor(textarea.scrollHeight / lineHeight);

    if (currentRows === previousRows) {
      textarea.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      textarea.rows = maxRows;
      textarea.scrollTop = textarea.scrollHeight;
    }

    setTextareaRows(currentRows < maxRows ? currentRows : maxRows);
  }, [input]);

  function transformData(data) {
    const result = {};

    data.forEach((item, index) => {
      const tasksArray = item.tasks.split(";").map((task, taskIndex) => ({
        id: index * 100 + taskIndex + 1,
        name: task.trim(),
        checked: false,
      }));

      result[item.month] = tasksArray;
    });

    return result;
  }

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  function cleanText(text) {
    // Replace all newline characters with a space
    let cleanedText = text.replace(/[\r\n]+/g, " ");

    // Remove unnecessary spaces at the end of each line
    cleanedText = cleanedText.replace(/\s+$/gm, "");

    // Replace multiple spaces with a single space
    cleanedText = cleanedText.replace(/\s\s+/g, " ");

    // Trim leading and trailing spaces
    cleanedText = cleanedText.trim();

    return cleanedText;
  }

  function splitText(text, searchString) {
    // Find the index of the search string in the text
    const index = text.indexOf(searchString);

    // If the search string is not found, return the original text as the first part and an empty string as the second part
    if (index === -1) {
      return [text, ""];
    }

    // Extract the part before the search string
    const part1 = cleanText(text.substring(0, index).trim());

    // Extract the part after the search string
    const part2 = text.substring(index + searchString.length).trim();
    const regex = new RegExp(searchString, "g");

    // Replace all occurrences of the search string with an empty string
    const result = part2.replace(regex, "");

    return [part1, result];
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    const newMessage: Message = {
      id: messages.length + 1,
      content: input,
      role: "user",
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [initialPrompt, ...updatedMessages].map(
            ({ role, content }) => ({ role, content })
          ),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const botMessage: Message = response.data.choices[0].message;
      if (botMessage.content.includes("BrightBestie")) {
        let result = splitText(botMessage.content, "BrightBestie");
        console.log(result);
        let message: Message = {
          id: 100,
          content: result[0],
          role: "assistant",
        };
        setMessages([...updatedMessages, message]);
        setCanEnd(true);
      } else {
        setMessages([...updatedMessages, botMessage]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  const handleEndChat = async (e) => {
    e.preventDefault();

    const newMessage: Message = {
      id: messages.length + 1,
      content: `Berikan rangkuman apa yang Anda ketahui tentang saya dari pertanyaan yang telah Anda ajukan.`,
      role: "user",
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [initialPrompt, ...messages, newMessage].map(
            ({ role, content }) => ({ role, content })
          ),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const botMessage: Message = response.data.choices[0].message;

      let messageFinal: Message = {
        id: messages.length + 1,
        content: `Tracker has been generated. You will be redirected to tracker page within 3 seconds. 
          If you are not logged in yet, please login first.`,
        role: "assistant",
      };
      setMessages([...messages, messageFinal]);
      localStorage.setItem("data", botMessage.content);
      setCanEnd(false);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      (lastMessageRef.current as unknown as HTMLDivElement).scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }, [messages]);

  return (
    <>
      <Navbar hidden />
      <div className="w-full max-w-3xl mx-auto border border-gray-200 rounded-lg bg-white shadow-md flex flex-col h-[100vh] -mt-16">
        <div
          className="flex items-center p-2"
          style={{ backgroundColor: "#FFF0C8" }}
        >
          <div className="w-24 h-24">
            <Lottie animationData={chatbotAnimation} loop={true} />
          </div>
          <div className="ml-4">
            <div className="font-bold">Your ConsultBuddy.AI</div>
            <div className="text-sm text-gray-500">🟢 Online</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 max-w-[70%] ${
                  message.role === "user"
                    ? "self-end text-white text-right"
                    : "self-start text-black text-left"
                }`}
                style={{
                  backgroundColor:
                    message.role === "user" ? "#069383" : "#E9E9E9",
                  borderRadius:
                    message.role === "user"
                      ? "20px 20px 0px 20px" // Rounded except bottom right
                      : "20px 20px 20px 0px", // Rounded except bottom left
                }}
              >
                <Markdown>{message.content}</Markdown>
              </div>
            </div>
          ))}
          {canEnd && (
            <div className="w-full flex justify-end">
              <button
                className="p-3 rounded-md bg-[#0b7b71] text-white"
                onClick={handleEndChat}
              >
                End Chat
              </button>
            </div>
          )}
          <div ref={lastMessageRef}></div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center p-4 bg-[#FFF0C8]"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message"
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows={textareaRows}
            style={{ lineHeight: "24px" }}
          />
          <button
            type="submit"
            className="ml-2 p-3 bg-[#0b7b71] text-white rounded-lg hover:bg-[#055851] transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
