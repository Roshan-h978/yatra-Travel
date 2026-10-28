import "./ChatBot.css";

import { Link } from "react-router-dom";

import { FaCommentDots, FaPaperPlane, FaTimes } from "react-icons/fa";

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
        text: "Thanks! This chat isn't monitored live. Please send your question through our Contact page and our team will reply by email.",
        link: true
      }
    ];

    setMessages(newMessages);

    setInput("");

  }

  return (

    <div className="chatbot-container">

      {/* CHAT BUTTON */}

      <button
        type="button"
        className="chat-toggle"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaCommentDots />}
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
                className={`chat-message ${msg.sender}`}
              >

                {msg.text}

                {msg.link && <> <Link to="/contact">Open Contact page</Link></>}

              </div>

            ))}

          </div>

          <form
            className="chat-input"
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          >

            <input
              type="text"
              placeholder="Type message..."
              value={input}
              onChange={(e)=>setInput(e.target.value)}
            />

            <button type="submit" aria-label="Send message">
              <FaPaperPlane aria-hidden="true" />
              <span className="chat-send-label">Send</span>
            </button>

          </form>

        </div>

      )}

    </div>

  );
}

export default ChatBot;