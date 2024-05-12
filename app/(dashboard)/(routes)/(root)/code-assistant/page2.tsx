"use client";
import { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import GPTLogo from "./GPTLogo";
import Image from "next/image";
import './compiler.css'

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the messages container whenever new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="pb-32 px-5">
      <div className="max-h-[calc(100vh-144px)] max-h-[calc(100vh-144px)] overflow-y-auto hide-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${message.role === "assistant" && "bg-gray-50"}`}
          >
            <div className="max-w-3xl mx-auto py-6 flex">
              {message.role === "assistant" && <GPTLogo />}
              {message.role === "user" && (
                <Image
                  src="/user.png"
                  alt="user"
                  width={35}
                  height={35}
                  className="rounded"
                />
              )}
              <span className="ml-3 max-w-[500px] block"><pre>{message.content}</pre></span>
            </div>
          </div>
        ))}
        {/* This empty div acts as a reference point for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      <form className="fixed inset-x-0 bottom-10 mx-auto px-5 md:ml-56" onSubmit={handleSubmit}>
        <input
          className="max-w-3xl shadow-xl w-full mx-auto py-8 flex h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background"
          placeholder="Send a message"
          required
          value={input}
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
