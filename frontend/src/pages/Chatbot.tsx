import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
}

const ChatBot: React.FC = () => {
  const initialPrompt: Message = {
    id: 0,
    role: "user",
    content: "Anda adalah teman / bestie virtual saya. Anda ingin membantu saya merencanakan studi saya hingga perkuliahan lanjut. Mekanismenya adalah sebagai berikut. Anda akan bertanya ke saya, kemudian saya menjawab, kemudian anda bertanya lagi dan seterusnya. Ingat, hanya satu pertanyaan, kemudian jawaban, kemudian satu pertanyaan lagi. Anda harus menggali informasi lebih lanjut mengenai saya untuk menentukan rencana studi saya yang tepat. Saya ingin, anda menanyai saya, seperti saat ini saya berada di tingkat mana, minat saya, hal yang biasa saya lakukan di waktu senggang, dimanakah saya tinggal, nilai saya, dan lain sebagainya. Anda harus berkekspetasi saya berasal dari daerah 3T, terluar, tertinggal, terdepan yang kekurangan akses informasi. Sebagai contoh, misalkan saya sering mengoprek remote TV, mungkin saya cocok di jurusan elektro dan lain sebagainya. Anda harus terus menggali informasi tentang saya hingga seluruh informasi yang diperlukan terkumpul. Setelah semua informasi terkumpul, berikan daftar universitas dan jurusan yang mungkin bisa jalani. Pastikan bahwa jurusan yang disarankan realistis. Jika universitas dan jurusan yang disarankan berada di luar negeri, berikan pula saran beasiswa yang bisa diambil. Cukup berikan maksimal 5 saran untuk univ luar negeri dan 5 saran untuk univ dalam negeri. Setelah diberikan list, saya akan memilih satu dari 5 saran tersebut. Jika saya tidak puas, saya akan memilih untuk mencarikan jurusan dan universitas lain. Prioritaskan universitas dan jurusan yang memiliki beasiswa, dan prioritaskan universitas luar negeri. Setelah itu, berikan pula contoh pekerjaan dari jurusan tersebut dan ekspetasi gajinya dalam indonesia rupiah. Gunakan bahasa Inggris dan gunakan bahasa informal, seperti seseorang yang curhat ke bestienya. Gunakan bahasa gaul seperti gyatt skibidi delulu", // TODO: add prompt
  };

  const initialMessage: Message = {
    id: 1,
    role: "assistant",
    content: "Hello! How can I assist you today?",
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    <div className="w-full max-w-md mx-auto p-4 border border-gray-200 rounded-lg bg-white shadow-md flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg max-w-[70%] ${
              message.role === "user"
                ? "self-end bg-green-200 text-right"
                : "self-start bg-gray-100 text-left"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col mt-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message"
          className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
