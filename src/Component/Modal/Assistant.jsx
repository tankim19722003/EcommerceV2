import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaRobot } from "react-icons/fa6";
import { FiMic, FiSend, FiX } from "react-icons/fi";
import assistantIcon from "../../assets/assistant.png";

function Assistant({ showAssistant }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào tôi có thể giúp gì được cho bạn?" },
  ]);
  const [input, setInput] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    setIsDialogOpen(!isVoiceMode);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ Web Speech API.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Transcript:", transcript);

      if (transcript.trim() !== "") {
        setMessages((prev) => [...prev, { sender: "user", text: transcript }]);
        const answerResponse = await callGemini(transcript);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: answerResponse },
        ]);
        speakText(answerResponse);
      }
    };

    recognition.onerror = (event) => {
      console.error("Lỗi ghi âm:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsAiThinking(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // ✅ Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
    setIsListening(true);
  };

  async function callGemini(promptText) {
    const question = `Bạn là một trợ lý ảo thân thiện. Hãy trả lời câu hỏi của người dùng một cách ngắn gọn, tự nhiên, lịch sự và dễ hiểu. Sau khi trả lời, hãy xử lý câu trả lời sao cho không còn ký tự đặc biệt như dấu chấm, dấu hai chấm, dấu gạch đầu dòng, dấu hoa thị, dấu xuống dòng. Trả lời chỉ bằng một đoạn văn liền mạch, không ngắt dòng, không có dấu câu, phù hợp để đọc to bằng giọng nói. Đây là câu hỏi của người dùng:
${promptText}`;
    const body = {
      contents: [
        {
          parts: [{ text: question }],
        },
      ],
    };

    try {
      setIsAiThinking(true);
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        body,
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
          },
        }
      );

      const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return result || "Xin lỗi, tôi không hiểu câu hỏi của bạn.";
    } catch (error) {
      alert("Gemini API error: " + (error.response?.data || error.message));
      return "Có lỗi xảy ra khi gọi API.";
    } finally {
      setIsAiThinking(false);
    }
  }

  function speakText(text) {
    const voiceName = "Vietnamese Female";
    const isVoiceAvailable = window.responsiveVoice
      .getVoices()
      .some((v) => v.name === voiceName);

    if (isVoiceAvailable) {
      window.responsiveVoice.speak(text, voiceName);
    } else {
      window.responsiveVoice.speak(text);
    }
  }

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    const responseText = await callGemini(userMessage);
    setMessages((prev) => [...prev, { sender: "bot", text: responseText }]);
    // speakText(responseText);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    showAssistant && (
      <>
        {/* Chat Box */}
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-40">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-center py-2 rounded-t-lg font-semibold flex justify-between px-3">
            <span>AI Assistant</span>
            <button
              onClick={toggleVoiceMode}
              className="text-white hover:text-gray-200 focus:outline-none cursor-pointer"
            >
              <img
                src={assistantIcon}
                alt="Assistant Icon"
                className="w-6 h-6 cursor-pointer"
              />
            </button>
          </div>

          {!isDialogOpen && (
            <>
              <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-teal-100 text-teal-900"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} /> {/* ✅ Auto-scroll target */}
              </div>
              <div className="p-2 border-t border-gray-200 flex flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-grow p-2 border rounded focus:outline-none border-gray-300 text-[16px]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />

                <button onClick={handleSendMessage} className="cursor-pointer">
                  <FiSend className="text-black text-2xl" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Voice Dialog */}
        {isDialogOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsDialogOpen(false);
                setIsVoiceMode(false);
              }
            }}
          >
            <div className="flex flex-col items-center text-white animate-fade-in ">
              <div
                className={`w-40 h-40 rounded-full bg-gray-500 flex items-center justify-center ${
                  isListening ? "animate-pulse bg-gray-400" : ""
                }`}
              >
                <span className="text-sm">
                  {isAiThinking
                    ? "Đang suy nghĩ..."
                    : isListening
                    ? "Đang nghe..."
                    : "Bắt đầu nói..."}
                </span>
              </div>
              <p className="mt-4 text-sm">
                {isAiThinking
                  ? "Đang suy nghĩ..."
                  : isListening
                  ? "Đang nghe..."
                  : "Chạm để nói"}
              </p>
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={startListening}
                  className="text-white hover:text-gray-300 focus:outline-none cursor-pointer"
                >
                  <FiMic className="text-2xl" />
                </button>
                <button
                  onClick={() => {
                    setIsListening(false);
                    setIsDialogOpen(false);
                    setIsVoiceMode(false);
                  }}
                  className="text-red-500 hover:text-red-700 focus:outline-none cursor-pointer"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  );
}

export default Assistant;
