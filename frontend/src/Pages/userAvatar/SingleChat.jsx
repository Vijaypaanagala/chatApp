import { useEffect, useState } from 'react';
import React from 'react';
import { ChatState } from '../../context/ChatProvider';
import ProfileInfo from '../subComponents/ProfileInfo';
import EditGroupChat from './EditGroupChat';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import { use } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LoadingSpinner from '../Loading/LoadingSpinner';

const ENDPOINT = 'http://localhost:3000';
let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat,setSelectedChat, notification, setNotification } = ChatState();
  const [showProfile, setShowProfile] = useState(false);
  const [showGroupEdit, setShowGroupEdit] = useState(false);
  const [message, setMessage] = useState('');
  const [msgArray, setMsgArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Initialize socket connection
    socket = io(ENDPOINT);
    socket.emit('setup', user);

    socket.on('connected', () => {
      console.log('Socket connected');
    });

    socket.on('message received', (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // If the chat is not selected, add the message to notifications
        if (!notification.some((n) => n.chat._id === newMessageReceived.chat._id)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain); // Trigger re-fetching chats
        }
      } else {
        // If the chat is selected, append the message to the current chat
        setMsgArray((prev) => [...prev, newMessageReceived]);
      }
    });

    return () => {
      socket.off('connected');
      socket.off('message received');
    };
  }, [notification, fetchAgain, selectedChatCompare]);
  console.log(notification)

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat; // Update the comparison chat
  }, [selectedChat]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3000/api/message/${selectedChat._id}`,
        config
      );
      setMsgArray(data);
      setLoading(false);
      socket.emit('join room', selectedChat._id);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setMessage('');
      const { data } = await axios.post(
        'http://localhost:3000/api/message',
        {
          content: message,
          chatId: selectedChat._id,
        },
        config
      );
      socket.emit('new message', data);
      setMsgArray((prev) => [...prev, data]);
      setFetchAgain(!fetchAgain)
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const typedHandle = (e) => {
    setMessage(e.target.value);
  };

  const handleClose = () => setShowProfile(false);
  const handleCloseGroup = () => setShowGroupEdit(false);

  const getUser = (loggedUser, users) =>
    users[0]._id === loggedUser._id ? users[1].name : users[0].name;

  const getPic = (loggedUser, users) =>
    users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;

  const getFull = (loggedUser, users) =>
    users[0]._id === loggedUser._id ? users[1] : users[0];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        padding: '20px',
        backgroundColor: '#fff',
      }}
    >
      {selectedChat ? (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
           
           {isSmallScreen && (
              
              //   style={{
              //     marginRight: '10px',
              //     padding: '5px 10px',
              //     border: 'none',
              //     backgroundColor: 'blue',
              //     color: 'white',
              //     borderRadius: '5px',
              //     cursor: 'pointer',
              //   }}
              
              
              <i className="fas fa-arrow-left" style={{marginRight:'10px',fontSize:'20px'}} onClick={() => setSelectedChat(null)}></i>
             
            )}

            {!selectedChat.isGroupChat ? (
              <>
                <img
                  src={getPic(user, selectedChat.users)}
                  alt="Profile"
                  className="rounded-circle"
                  style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowProfile(true)}
                />
                <h5 style={{ marginLeft: '10px', fontWeight: '500' }}>
                  {getUser(user, selectedChat.users)}
                </h5>
              </>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0 10px',
                }}
              >
                <h5>{selectedChat.chatName.toUpperCase()}</h5>
                <p
                  style={{ cursor: 'pointer', color: 'blue' }}
                  onClick={() => setShowGroupEdit(true)}
                >
                  Edit
                </p>
              </div>
            )}
          </div>

          <div
            style={{
              flexGrow: 1,
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              padding: '15px',
              overflowY: 'auto',
              width: '100%',
              height: '70vh',
              boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            {loading ? (
              <LoadingSpinner/>
            ) : (
              <>
                <ScrollableChat messages={msgArray} />
                {/* {isTyping &&!message ? <div>Typing...</div> : ''} */}
              </>
            )}
          </div>

          {/* Input Section */}
          <form
            style={{
              display: 'flex',
              marginTop: '10px',
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => typedHandle(e)}
              onKeyPress={handleKeyPress}
              style={{
                flexGrow: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
            <button
              type="button"
              onClick={sendMessage}
              style={{
                marginLeft: '10px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
              }}
            >
              Send
            </button>
          </form>
        </>
      ) : (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '250px' }}>
          Select a Chat to Start Chatting
        </p>
      )}

{showProfile && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile Info</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <ProfileInfo user={getFull(user, selectedChat.users)} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

       {/* Group Edit Modal */}
       {showGroupEdit && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedChat.chatName}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseGroup}
                ></button>
              </div>
              <div className="modal-body">
                <EditGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseGroup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleChat;
