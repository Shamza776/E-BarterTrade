import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { Search, PlusCircle } from "lucide-react";
import "./messages.css";

const socket = io("http://localhost:5000");

export default function MessagesPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Debug userId
  useEffect(() => {
    console.log("Current user:", currentUserId);
    console.log("URL userId:", userId);
  }, [userId, currentUserId]);

  // Initial data loading
  useEffect(() => {
    fetchConversations();
    
    // If userId is in URL, fetch that specific conversation
    if (userId) {
      fetchMessages(userId);
      fetchUserDetails(userId);
    }
    
    // Socket setup
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    
    socket.on("receive_message", (data) => {
      console.log("Message received via socket:", data);
      if (
        (data.senderId === userId && data.receiverId === currentUserId) ||
        (data.senderId === currentUserId && data.receiverId === userId)
      ) {
        setMessages((prev) => [...prev, data]);
      }
      
      // Update conversations list to show new message
      fetchConversations();
    });

    return () => {
      socket.off("receive_message");
    };
  }, [userId, currentUserId]);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messages.length) {
      const messagesContainer = document.querySelector('.messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Fetch all conversations for current user
  const fetchConversations = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/conversations/${currentUserId}`
      );
      console.log("Conversations:", res.data);
      setConversations(res.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details
  const fetchUserDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${id}`);
      setActiveUser(res.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch all users for new conversation
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users`);
      // Filter out current user
      const filteredUsers = res.data.filter(user => user._id !== currentUserId);
      setAllUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch messages between two users
  const fetchMessages = async (otherUserId) => {
    try {
      setLoading(true);
      console.log(`Fetching messages between ${currentUserId} and ${otherUserId}`);

      const res = await axios.get(
        `http://localhost:5000/api/messages/${currentUserId}/${otherUserId}`
      );

      console.log("Messages received:", res.data);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle chat selection
  const selectChat = (otherUserId) => {
    navigate(`/messages/${otherUserId}`);
    fetchUserDetails(otherUserId);
    fetchMessages(otherUserId);
  };

  // Send message function
  const sendMessage = async () => {
    if (!message.trim() || !userId) return;

    const newMessage = {
      senderId: currentUserId,
      receiverId: userId,
      content: message,
    };

    try {
      // Send via socket
      socket.emit("send_message", newMessage);
      
      // Save to database
      await axios.post("http://localhost:5000/api/messages", newMessage);
      
      // Update UI
      setMessages([...messages, newMessage]);
      setMessage("");
      
      // Update conversations list
      fetchConversations();

      // Scroll to bottom
      setTimeout(() => {
        const messagesContainer = document.querySelector('.messages');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Open new conversation modal
  const openNewChatModal = () => {
    fetchAllUsers();
    setShowNewChatModal(true);
  };

  // Start new conversation
  const startNewConversation = (userId) => {
    setShowNewChatModal(false);
    navigate(`/messages/${userId}`);
    fetchUserDetails(userId);
    fetchMessages(userId);
  };

  // Filter conversations by search query
  const filteredConversations = conversations.filter(
    conv => conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter users by search query
  const filteredUsers = allUsers.filter(
    user => user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>Messages</h1>
        <p>Chat with other users</p>
      </div>
      
      <div className="messages-layout">
        {/* Conversations Sidebar */}
        <div className="conversations">
          <div className="conversation-header">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button 
              className="new-conversation-btn"
              onClick={openNewChatModal}
            >
              <PlusCircle size={20} />
              <span>New Chat</span>
            </button>
          </div>
          
          {loading && !filteredConversations.length ? (
            <p className="loading-text">Loading conversations...</p>
          ) : filteredConversations.length === 0 ? (
            <div className="empty-state">
              <p>No conversations yet</p>
              <button 
                className="start-chat-btn"
                onClick={openNewChatModal}
              >
                Start a conversation
              </button>
            </div>
          ) : (
            <div className="conversation-list">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.user._id}
                  className={`conversation-item ${conv.user._id === userId ? 'active' : ''}`}
                  onClick={() => selectChat(conv.user._id)}
                >
                  <div>
                    <div className="conversation-name">{conv.user.name}</div>
                    <div className="conversation-message">{conv.lastMessage}</div>
                  </div>
                  <div className="conversation-time">
                    {conv.lastTimestamp && new Date(conv.lastTimestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Chat Window */}
        <div className="chat-window">
          {!userId ? (
            <div className="no-chat-selected">
              <h3>Select a conversation or start a new one</h3>
              <button 
                className="start-chat-btn"
                onClick={openNewChatModal}
              >
                Start a conversation
              </button>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <h3>{activeUser?.name || "Chat"}</h3>
              </div>

              {/* Messages Display */}
              <div className="messages">
                {loading ? (
                  <div className="loading">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="no-messages">
                    <p>No messages yet. Send a message to start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`message ${
                        msg.senderId === currentUserId ? "sent" : "received"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <div className="message-time">
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="message-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Start New Conversation</h3>
              <button className="close-btn" onClick={() => setShowNewChatModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search users..." 
                value={userSearchQuery}
                onChange={e => setUserSearchQuery(e.target.value)}
              />
              <div className="user-list">
                {filteredUsers.length === 0 ? (
                  <p className="no-results">No users found</p>
                ) : (
                  filteredUsers.map(user => (
                    <div 
                      key={user._id} 
                      className="user-item"
                      onClick={() => startNewConversation(user._id)}
                    >
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}