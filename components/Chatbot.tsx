"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const userMsg = text || message;
    if (!userMsg) return;

    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chatbot", {
        message: userMsg,
        userId: "user1"
      });

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: res.data.reply }
      ]);

      setSuggestions(res.data.suggestions || []);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "حصل خطأ 😅" }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* زرار الفتح */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#e63946",
          color: "#fff",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          border: "none",
          cursor: "pointer",
          fontSize: "22px",
          zIndex: 9999
        }}
      >
        💬
      </button>

      {/* الشات */}
      {open && (
        <div style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "400px",
            maxWidth: "calc(100vw - 40px)",
            height: "70vh",
            background: "#f7f7f7",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
            zIndex: 9999,
            direction: "rtl",
          }}>

          {/* Header */}
          <div style={{
            background: "#e63946",
            color: "#fff",
            padding: "10px",
            textAlign: "center",
            fontWeight: "bold"
          }}>
            مساعد التبرع بالدم 
          </div>

          {/* الرسائل */}
          <div style={{
            flex: 1,
            padding: "10px",
            overflowY: "auto"
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "8px"
              }}
              >

                <div 
                style={{
                    background: msg.sender === "user" ? "#dcf8c6" : "#fff",
                    padding: "10px 14px",
                    borderRadius:
                      msg.sender === "user"
                        ? "15px 15px 3px 15px"
                        : "15px 15px 15px 3px",
                    maxWidth: "85%",
                    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                    lineHeight: "2",
                    fontSize: "14px",
                    textAlign: "right",
                    direction: "rtl",
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                  }}
                >

                {Array.isArray(msg.text) ? (
                <ul style={{ paddingRight: "15px" }}>
                    {msg.text.map((item: string, i: number) => (
                    <li key={i} style={{ marginBottom: "5px" }}>
                        <span
                        dangerouslySetInnerHTML={{
                            __html: item.replace(
                            new RegExp("(https?:\\/\\/[^\\s]+)", "g"),
                            '<a href="$1" target="_blank" style="color:blue;text-decoration:underline;">$1</a>'
                            )
                        }}
                        />
                    </li>
                    ))}
                </ul>
                ) : (
                <span
                dangerouslySetInnerHTML={{
                __html: String(msg.text).replace(
                    new RegExp("(https?:\\/\\/[^\\s]+)", "g"),
                    '<a href="$1" style="color:blue;text-decoration:underline;">$1</a>'
                )
                }}                />
                                )}                
                </div>
                  <div style={{
                    fontSize: "10px",
                    textAlign: "left",
                    color: "#999",
                    marginTop: "2px"
                  }}>
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>            ))}

            {/* loading */}
            {loading && (
              <div style={{ textAlign: "left", color: "#888" }}>
                بيكتب...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* suggestions */}
          <div style={{ padding: "5px" }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                style={{
                  margin: "2px",
                  padding: "5px 8px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#457b9d",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* input */}
          <div style={{
            display: "flex",
            borderTop: "1px solid #ddd"
          }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                outline: "none"
              }}
              placeholder="اكتب سؤالك..."
            />
            <button
              onClick={() => sendMessage()}
              style={{
                padding: "10px",
                background: "#e63946",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
}