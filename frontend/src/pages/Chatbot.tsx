import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import axios from "axios";

import ChatbotProfileImage from "../assets/chatbot-profile.svg";

interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
}

const ChatBot: React.FC = () => {
  const initialPrompt: Message = {
    id: 0,
    role: "user",
    content:
      "Anda adalah teman / bestie virtual saya. Anda ingin membantu saya merencanakan studi saya hingga perkuliahan lanjut. Mekanismenya adalah sebagai berikut. Anda akan bertanya ke saya, kemudian saya menjawab, kemudian anda bertanya lagi dan seterusnya. Ingat, hanya satu pertanyaan, kemudian jawaban, kemudian satu pertanyaan lagi. Anda harus menggali informasi lebih lanjut mengenai saya untuk menentukan rencana studi saya yang tepat. Saya ingin, anda menanyai saya, seperti saat ini saya berada di tingkat mana, minat saya, hal yang biasa saya lakukan di waktu senggang, dimanakah saya tinggal, nilai saya, dan lain sebagainya. Anda harus berkekspetasi saya berasal dari daerah 3T, terluar, tertinggal, terdepan yang kekurangan akses informasi. Sebagai contoh, misalkan saya sering mengoprek remote TV, mungkin saya cocok di jurusan elektro dan lain sebagainya. Anda harus terus menggali informasi tentang saya hingga seluruh informasi yang diperlukan terkumpul. Setelah semua informasi terkumpul, berikan daftar universitas dan jurusan yang mungkin bisa jalani. Pastikan bahwa jurusan yang disarankan realistis. Jika universitas dan jurusan yang disarankan berada di luar negeri, berikan pula saran beasiswa yang bisa diambil. Cukup berikan maksimal 5 saran untuk univ luar negeri dan 5 saran untuk univ dalam negeri. Setelah diberikan list, saya akan memilih satu dari 5 saran tersebut. Jika saya tidak puas, saya akan memilih untuk mencarikan jurusan dan universitas lain. Prioritaskan universitas dan jurusan yang memiliki beasiswa, dan prioritaskan universitas luar negeri. Setelah itu, berikan pula contoh pekerjaan dari jurusan tersebut dan ekspetasi gajinya dalam indonesia rupiah. Gunakan bahasa Inggris dan gunakan bahasa informal, seperti seseorang yang curhat ke bestienya. Gunakan bahasa gaul seperti gyatt skibidi delulu", // TODO: add prompt
  };

  const initialMessage: Message = {
    id: 1,
    role: "assistant",
    content: "Hello! How can I assist you today?",
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState<string>("");

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

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

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
      setMessages([...updatedMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto border border-gray-200 rounded-lg bg-white shadow-md flex flex-col h-[100vh]">
      <div
        className="flex items-center p-4"
        style={{ backgroundColor: "#FFF0C8" }}
      >
        <img
          src={ChatbotProfileImage}
          alt="Avatar"
          className="w-16 h-16 rounded-full"
        />
        <div className="ml-4">
          <div className="font-bold">Your BrightBuddy</div>
          <div className="text-sm text-gray-500">2 Min</div>
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
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-4"
        style={{ backgroundColor: "#FFF0C8" }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          rows={textareaRows}
          style={{ lineHeight: "24px" }}
        />
        <button
          type="submit"
          className="ml-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
