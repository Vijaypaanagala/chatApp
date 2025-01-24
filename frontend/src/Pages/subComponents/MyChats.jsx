import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import '../../styles/MyChats.css'; // Import your CSS file
import { ChatState } from '../../context/ChatProvider';
import ChatLoading from '../Loading/ChatLoading';
import UserChatItem from '../userAvatar/UserChatItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import dpic from '../../assets/groppic.png'

function MyChats({fetchAgain}) {
  const { user, chats, setChats ,selectedChat,setSelectedChat,notification} = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const [activeChatId, setActiveChatId] = useState(null); // Track the active chat
    const [showProfile, setShowProfile] = useState(false);
    const handleClose = () => setShowProfile(false);
    const [GroupName,setGroupName]=useState('');
    const [selectedusers,setSelectedUsers]=useState([])
    const [search,setSearch]=useState('');
    const [searchresults,setSearchResults]= useState([])
      const [isLoading,setLoading] =useState(false);
      const [loading,SetLoading]=useState(false);
    

  // Helper functions
  const getUser = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };
  const getPic = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
  };
  const getEmail = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].email : users[0].email;
  };
 
  const handleClickUser=(usertoAdd)=>{
    if(selectedusers.includes(usertoAdd)){
      alert('user already exists');
      return ;
    }
    setSelectedUsers([...selectedusers,usertoAdd]);
  }
  
  const handlesearch=async (query)=>{
    if(!query){
      return ;
    }
    setSearch(query);
       const config={
            headers:{
              authorization:`Bearer ${user.token}`
            }
          }
          console.log(user.token)
          setLoading(true);
          const {data}=await axios.get(`https://chatapp-f2ec.onrender.com/api/user?search=${search}`,config);
          setSearchResults(data);
          setLoading(false);
  }

  // Fetch chats
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      // SetLoading(true);
      const { data } = await axios.get('https://chatapp-f2ec.onrender.com/api/chat', config);
      SetLoading(false);
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setLoggedUser(JSON.parse(storedUser));
    }
    fetchChats();
  }, [fetchAgain]);

  // Handle chat click
  const handleChatClick = (chat) => {
    setActiveChatId(chat._id); 
    setSelectedChat(chat);
  };
  const handleCreate = async () => {
    const config = {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };
  
    console.log(user.token);
    setLoading(true);
  
    try {
      const { data } = await axios.post(
        "https://chatapp-f2ec.onrender.com/api/chat/group",
        {
          name: GroupName,
          users: selectedusers.map((u) => u._id), 
        },
        config
      );
  
      setChats([data, ...chats]);
      console.log(data);
      setLoading(false);
      setShowProfile(false);
  
    
      setGroupName("");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error creating group chat:", error);
      setLoading(false);
    }
  };
  
console.log(chats)
  return (
    <div className="container" style={{height:'90vh'}}>
      {/* Header Section */}
      <div className="d-flex align-items-center justify-content-between my-3">
        <h2 className="mb-0">My Chats</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowProfile(true)} >+ New Group</button>
      </div>

      {/* Chats Section */}
      {loading ? (
  <ChatLoading />
) : (
  chats && chats.length > 0 ? (
    chats.map((chat) => (
      <div
        key={chat._id}
        className={`d-flex align-items-center p-2 border-bottom chat-item ${
          activeChatId === chat._id ? 'active-chat' : ''
        }`}
        style={{
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onClick={() => handleChatClick(chat)}
      >
        {chat.isGroupChat ? (
          // Group Chat Display
          <>
            <img
              src={dpic}
              alt="User Pic"
              className="rounded-circle me-3"
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
            {/* User Details */}
            <div className="flex-grow-1">
              <h5 className="mb-1 text-truncate" style={{ maxWidth: '200px' }}>
                {chat.chatName}
              </h5>
              <p className="mb-0 text-muted text-truncate" style={{ maxWidth: '200px' }}>
                {notification.find((notif) => notif.chat._id === chat._id) ? (
                  <span style={{ color: 'blue' }}>New Message</span>
                ) : (
                  chat.latestMessage?.content || ""
                )}
              </p>
            </div>
          </>
        ) : (
          // One-on-One Chat Display
          <>
            <img
              src={getPic(loggedUser, chat.users)}
              alt="User Pic"
              className="rounded-circle me-3"
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
            {/* User Details */}
            <div className="flex-grow-1">
              <h5 className="mb-1 text-truncate" style={{ maxWidth: '200px' }}>
                {getUser(loggedUser, chat.users)}
              </h5>
              <p className="mb-0 text-muted text-truncate" style={{ maxWidth: '200px' }}>
                {notification.find((notif) => notif.chat._id === chat._id) ? (
                  <span style={{ color: 'blue' }}>New Message</span>
                ) : (
                  chat.latestMessage?.content || getEmail(loggedUser, chat.users)
                )}
              </p>
            </div>
          </>
        )}
      </div>
    ))
  ) : (
    <p className="text-center text-muted">No chats available</p>
  )
)}

     




      {showProfile && (
  <div
    className="modal show d-block"
    tabIndex="-1"
    role="dialog"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content rounded-3 shadow-lg">
        <div className="modal-header border-0">
          <h5 className="modal-title">Create Group Chat</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={handleClose}
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="groupNameInput" className="form-label">
              Group Name
            </label>
            <input
              type="text"
              id="groupNameInput"
              className="form-control"
              placeholder="Enter Group Name"
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="searchInput" className="form-label">
              Search Users
            </label>
            <input
              type="text"
              id="searchInput"
              className="form-control"
              placeholder="Search users to add"
              onChange={(e) => handlesearch(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Selected Users</label>
            <div className="d-flex flex-wrap">
              {selectedusers.map((u) => (
                <div
                  key={u._id}
                  className="badge bg-primary text-white me-2 mb-2 d-flex align-items-center"
                  style={{ padding: '10px', borderRadius: '20px' }}
                >
                  <span>{u.name}</span>
                  <FontAwesomeIcon
                    icon={faTimes}
                    size="sm"
                    style={{
                      marginLeft: '8px',
                      cursor: 'pointer',
                      fontSize: '1.1em',
                    }}
                    onClick={() => {
                      setSelectedUsers(selectedusers.filter(user => user._id !== u._id));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
  {isLoading ? (
    <center><p>Loading....</p></center>
  ) : search !== "" && searchresults.length === 0 ? (
    <center><p>No users found </p></center>
  ) : (
    searchresults.slice(0, 4).map(user => (
      <div key={user._id}>
        <UserChatItem
          user={user}
          handleFunction={() => handleClickUser(user)}
        />
      </div>
    ))
  )}
</div>


        </div>
        <div className="modal-footer border-0">
          <button
            type="button"
            className="btn btn-success w-100"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
    
  );
}

export default MyChats;
