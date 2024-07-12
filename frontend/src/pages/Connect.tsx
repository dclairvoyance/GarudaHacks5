import React, { useState, useRef } from "react";
import Papa from "papaparse";
import axios from "axios";
import TaskDetailModal from "../components/TaskDetailsModal";
import Upload from "../components/Upload";
import UploadModal from "../components/UploadModal";
import CustomCalendar from "../components/CustomCalendar";
import Reminder from "../components/Reminder";
import Navbar from "../components/Navbar";

import { ChevronRightIcon } from '@heroicons/react/20/solid'

const people = [
  {
    id: 1,
    name: 'Marcellus Michael Herman Kahari',
    email: 'michaelkaharir@gmail.com',
    role: 'ITB Student',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    id: 2,
    name: 'Putri Nurhaliza',
    email: 'lili@stei.itb.ac.id',
    role: 'PhD Zurich',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    id: 3,
    name: 'Damianus Clair',
    email: 'clair@yahoo.com',
    role: 'Mext Scholar',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: null,
  },
  {
    id: 4,
    name: 'Aditya P.N.',
    email: 'adit@rocketmail.com',
    role: 'UI',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    id: 5,
    name: 'Jeffrey',
    email: 'jep@yahoo.com',
    role: 'UGM',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    id: 6,
    name: 'Feli',
    email: 'feli@example.com',
    role: 'MIT',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: null,
  },
]



interface Message {
    id: number;
    content: string;
    role: "user" | "assistant";
  }


const ConnectPages: React.FC = () => {
    const initialMessage1: Message = {
        id: 0,
        content: "Hello! How can I help you today?",
        role: "assistant",
    };
    const initialMessage2: Message = {
        id: 1,
        content: "I need help with my life journey",
        role: "user",
    };
    const initialMessage3: Message = {
        id: 2,
        content: "I want to ask about my career",
        role: "user",
    };
    const initialMessage4: Message = {
        id: 3,
        content: "I want to ask about my education",
        role: "user",
    };
    const initialMessage5: Message = {
        id: 4,
        content: "Okay, tell me more about your problem",
        role: "assistant",
    };

    const initialMessage6: Message = {
        id: 4,
        content: "Okay, I'll help you with that",
        role: "assistant",
    };
    const [messages1, setMessages1] = useState<Message[]>([initialMessage1, initialMessage2, initialMessage5]);
    const [messages2, setMessages2] = useState<Message[]>([initialMessage1, initialMessage3]);
    const [messages3, setMessages3] = useState<Message[]>([initialMessage1, initialMessage4, initialMessage6]);
    const [user, setUser] = useState<number>(1);
    const [messages, setMessages] = useState<Message[]>(messages1);

    const handleUserChange = (user: number) => {
        setUser(user);
        if (user === 1) {
            setMessages(messages1);
        } else if (user === 2) {
            setMessages(messages2);
        } else {
            setMessages(messages3);
        }
    };
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);




  return (
    <>
      <Navbar hidden />

      <div
        className="w-full items-center justify-between h-screen bg-cover bg-center -mt-16"
        style={{ backgroundImage: "url('./BG2.svg')" }}
      >
              <div className="mx-auto max-w-2xl text-center pt-20 pb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Connect with People
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Helps Others
            </p>
          </div>
        <div className="relative flex flex-col md:flex-row">
        <div className="p-6 w-full md:w-[50%] my-auto">
        <ul role="list" className="divide-y divide-gray-100">
      {people.map((person) => (
        <li
        onClick={() => handleUserChange(person.id)}
          key={person.email}
          className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 lg:px-8"
        >
          <div className="flex min-w-0 gap-x-4">
            <img alt="" src={person.imageUrl} className="h-12 w-12 flex-none rounded-full bg-gray-50" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                <a href={person.href}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {person.name}
                </a>
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
                <a href={`mailto:${person.email}`} className="relative truncate hover:underline">
                  {person.email}
                </a>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">{person.role}</p>
              {person.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
              )}
            </div>
            <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
          </div>
        </li>
      ))}
    </ul>
        </div>
        <div className="p-8 w-full md:w-[50%] shadow-lg rounded-lg h-[85vh]">
        
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
          <form
          className="flex items-center p-4 absolute bottom-20 w-[45%]"
        >
          <textarea
            //ref={textareaRef}
            //value={input}
            //onChange={handleInputChange}
            placeholder="Type a message"
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
        
              }
            }}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows={1}
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
        </div>
      </div>
    </>
  );
};

export default ConnectPages;
