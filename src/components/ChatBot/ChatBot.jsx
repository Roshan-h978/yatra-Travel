import "./ChatBot.css";

import { useState } from "react";

function ChatBot() {

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋 Welcome to Yatra. How can we help you today?"
    }
  ]);

  const [input, setInput] = useState("");

  function sendMessage() {

    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      {
        sender: "user",
        text: input
      },
      {
        sender: "bot",
        text: "Thank you for your inquiry. Our team will contact you shortly."
      }
    ];

    setMessages(newMessages);

    setInput("");

  }

  return (

    <div className="chatbot-container">

      {/* CHAT BUTTON */}

      <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
      >
        Chat
      </button>

      {/* CHAT BOX */}

      {open && (

        <div className="chat-box">

          <div className="chat-header">

            <h3>Yatra Support</h3>

          </div>

          <div className="chat-messages">

            {messages.map((msg,index)=>(

              <div
                key={index}
                className={`message ${msg.sender}`}
              >

                {msg.text}

              </div>

            ))}

          </div>

          <div className="chat-input">

            <input
              type="text"
              placeholder="Type message..."
              value={input}
              onChange={(e)=>setInput(e.target.value)}
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </div>

        </div>

      )}

    </div>

  );
}

export default ChatBot;