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
    role: "assistant",
    content: "Hello! How can I assist you today?",
  };

  const [messages, setMessages] = useState<Message[]>([]);
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
