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
  const initialPrompt: Message = {
    id: 0,
    role: "user",
    /*     content: `Buatkan tracker bulanan untuk persiapan beasiswa GKS dari sekarang kelas 10 semester 1 sampai kelas 12 semester 2.
                 Kondisi saat ini, saya tinggal di Ternate, membutuhkan beasiswa, nilai rapor saya rata-rata 95, dan belum mahir berbahasa inggris.
                 Usahakan tracker mengandung nilai kuantitatif, contoh membaca buku The Official Academic Guide to IELTS halaman 1-10. 
                 Detailkan pula setiap dokumen syarat pendaftaran. 
                 Buatlah dalam format csv dengan header: 'month (bulan, dari bulan ini)' dan 'tasks' (daftar tugas dengan nilai kuantitatif, pisahkan setiap tugas dengan titik koma, jangan gunakan koma).
                 Hilangkan pembuka dan penutup. Gunakan bahasa Inggris. Hilangkan pembuka dan penutup. Gunakan bahasa Inggris. Jika sudah selesai melakukan generate CSV, cukup keluarkan CSV nya.` */
    content: `Anda adalah teman / bestie virtual saya. Anda ingin membantu saya merencanakan studi 
      saya hingga perkuliahan lanjut. Mekanismenya adalah sebagai berikut. Anda akan bertanya ke saya, 
      kemudian saya menjawab, kemudian anda bertanya lagi dan seterusnya. Ingat, hanya satu pertanyaan, 
      kemudian jawaban, kemudian satu pertanyaan lagi. Anda harus menggali informasi lebih lanjut mengenai 
      saya untuk menentukan rencana studi saya yang tepat. Saya ingin, anda menanyai saya, seperti saat ini 
      saya berada di tingkat mana, minat saya, hal yang biasa saya lakukan di waktu senggang, 
      dimanakah saya tinggal, nilai saya, dan lain sebagainya. Anda harus berkekspetasi saya berasal dari daerah 3T, 
      terluar, tertinggal, terdepan yang kekurangan akses informasi. Sebagai contoh, misalkan saya sering mengoprek remote TV, 
      mungkin saya cocok di jurusan elektro dan lain sebagainya. Anda harus terus menggali informasi tentang saya hingga 
      seluruh informasi yang diperlukan terkumpul. Setelah semua informasi terkumpul, berikan daftar universitas dan 
      jurusan yang mungkin bisa jalani. Pastikan bahwa jurusan yang disarankan realistis. Jika universitas dan jurusan 
      yang disarankan berada di luar negeri, berikan pula saran beasiswa yang bisa diambil. Cukup berikan maksimal 5 saran untuk univ 
      luar negeri dan 5 saran untuk univ dalam negeri. Setelah diberikan list, saya akan memilih satu dari 5 saran tersebut. 
      Jika saya tidak puas, saya akan memilih untuk mencarikan jurusan dan universitas lain. Prioritaskan universitas dan jurusan yang memiliki 
      beasiswa, dan prioritaskan universitas luar negeri. Setelah itu, berikan pula contoh pekerjaan dari jurusan tersebut dan ekspetasi 
      gajinya dalam indonesia rupiah. Gunakan bahasa Inggris dan gunakan bahasa informal, seperti seseorang yang curhat ke bestienya. 
      Gunakan bahasa gaul seperti gyatt skibidi delulu. Gunakan emoticon sehingga lebih ramah, tapi jangan berlebihan. 
      
      Setelah semua informasi didapatkan dan pengguna sudah memilih universitas, buatkan tracker bulanan untuk persiapan beasiswa yang dipilih dari jenjang kelas saat ini sampai kelas 12 semester 2. Anda tidak akan menerima informasi lebih lanjut, jadi cukup buatkan langsung trackernya. Jangan gunakan kata pengatar apapun, hanya keluarkan CSV NYA SAJA.
        Kondisi saat ini, saya tinggal dilokasi dimana saya sudah menyebutkan sebelumnya, membutuhkan beasiswa, nilai rapor saya rata-rata sesuai informasi yang digathering, dan kemampuan berbahasa Inggris sesuai dengan kondisi saya saat ini.
        Usahakan tracker mengandung nilai kuantitatif dan terdapat evaluasi yang kuantitatif, contoh membaca buku The Official Academic Guide to IELTS halaman 1-10 dan mengerjakan soal latihan halaman 19 - 20 sebanyak 30 soal dan harus benar minimal 80%. 
        Detailkan pula setiap dokumen syarat pendaftaran beasiswa dan / atau pendaftaran universitas. 
        Buatlah dalam format csv dengan header: 'month (bulan, dari bulan ini)' dan 'tasks' (daftar tugas dengan nilai kuantitatif, pisahkan setiap tugas dengan titik koma, jangan gunakan koma).
        Hilangkan pembuka dan penutup. Gunakan bahasa Inggris. Jika sudah selesai melakukan generate CSV, cukup keluarkan CSV. Jika anda ingin mulai menulis CSV, gunakan penanda "ABCDE"`,
    // TODO: add prompt
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
      if (botMessage.content.includes("ABCDE")) {
        let result = splitText(botMessage.content, "ABCDE");
        console.log(result);
        let message: Message = {
          id: 100,
          content: result[0],
          role: "assistant",
        };
        //const charactersToRemove = "qwertyuiopasdfghjklzxcvbnm";
        setMessages([...updatedMessages, message]);
        // Create a regular expression pattern with global and case-insensitive flags
        //const regex = new RegExp(`[${charactersToRemove}]`, 'gi');

        // Replace the characters with an empty string
        //const cleanedText = response.data.choices[0].message.content.replace(regex, '');

        const csvContent = result[1];

        const formattedCSVContent = csvContent.replace(
          /(".*?")/g,
          (match: string) => {
            return match.replace(/,/g, ";");
          }
        );

        const parsedData = Papa.parse(formattedCSVContent, {
          header: true,
          skipEmptyLines: true,
        });

        let messageFinal: Message = {
          id: 101,
          content:
            "Tracker has been generated. You will be redirected to tracker page within 3 seconds. If you are not login yet, please login first.",
          role: "assistant",
        };
        setMessages([...updatedMessages, messageFinal]);
        setTimeout(() => {
          navigate("/login");
        }, 3000);

        let transformedData = transformData(parsedData.data);
        transformedData = JSON.stringify(transformedData);
        localStorage.setItem("data", transformedData);
      } else {
        setMessages([...updatedMessages, botMessage]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <>
      <Navbar hidden />
      <div className="w-full max-w-3xl mx-auto border border-gray-200 rounded-lg bg-white shadow-md flex flex-col h-[100vh]">
        <div
          className="flex items-center p-2"
          style={{ backgroundColor: "#FFF0C8" }}
        >
          <div className="w-24 h-24">
            <Lottie animationData={chatbotAnimation} loop={true} />
          </div>
          <div className="ml-4">
            <div className="font-bold">Your BrightBestie</div>
            <div className="text-sm text-gray-500">Online</div>
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
    </>
  );
};

export default ChatBot;
