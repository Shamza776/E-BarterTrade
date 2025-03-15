import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import "./messages.css";

const socket = io("http://localhost:5000");

export default function MessagesPage() {
  const { userId } = useParams(); // ✅ Get userId from URL
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Debug: Check if `userId` is being received
  useEffect(() => {
    console.log("🟡 userId received from URL:", userId);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchMessages();
      socket.on("receive_message", (data) => {
        setMessages((prev) => [...prev, data]);
      });
    }
    return () => socket.off("receive_message");
  }, [userId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      console.log(`🔵 Fetching messages for user: ${userId}`);

      const res = await axios.get(
        `http://localhost:5000/api/messages/${localStorage.getItem("userId")}/${userId}`
      );

      console.log("✅ Messages received:", res.data);
      setMessages(res.data);
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      senderId: localStorage.getItem("userId"),
      receiverId: userId,
      content: message,
    };

    socket.emit("send_message", newMessage);
    await axios.post("http://localhost:5000/api/messages", newMessage);
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <div className="messages-container">
      <h1>Chat</h1>

      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <div className="no-chats">
          <p>No chats started yet. Send a message to start a conversation!</p>
        </div>
      ) : (
        <>
          <div className="chat-box">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${
                  msg.senderId === localStorage.getItem("userId") ? "sent" : "received"
                }`}
              >
                <p>{msg.content}</p>
              </div>
            ))}
          </div>

          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}
