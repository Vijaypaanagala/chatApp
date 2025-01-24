import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial render
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  });
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const navigate = useNavigate();
  const location = useLocation(); // To get the current route

  useEffect(() => {
    if (!user && location.pathname !== "/signup") {
      navigate("/Login"); // Redirect to Login if no user and not on Signup page
    }
  }, [user, navigate, location.pathname]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
