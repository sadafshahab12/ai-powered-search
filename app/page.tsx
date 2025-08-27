"use client";
import { useState } from "react";
import axios from "axios";
export default function Home() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<
    {
      sender: "user" | "ai";
      text: string;
    }[]
  >([]);
  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessage((prev) => [...prev, { sender: "user", text: input }]);
    const res = await axios.post("/api/gemini", { prompt: input });
    const reply = res.data.reply;
    setMessage((prev) => [
      ...prev,
      { sender: "user", text: input },
      { sender: "ai", text: reply },
    ]);
    setInput("");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 border-b text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl">
          Gemini Assistant 💡
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {message.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={input}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Gemini Anything..."
            className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
