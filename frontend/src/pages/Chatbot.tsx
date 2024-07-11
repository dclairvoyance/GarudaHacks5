import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'sender' | 'receiver';
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSender, setIsSender] = useState(true); // Toggle to simulate different users

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (input.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: isSender ? 'sender' : 'receiver'
      };
      setMessages([...messages, newMessage]);
      setInput('');
      setIsSender(!isSender); // Toggle sender
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border border-gray-200 rounded-lg bg-white shadow-md flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg max-w-[70%] ${message.sender === 'sender' ? 'self-end bg-green-200 text-right' : 'self-start bg-gray-100 text-left'}`}
          >
            {message.text}
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
