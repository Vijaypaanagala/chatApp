import React, { useState } from "react";
import ProfileInfo from "./ProfileInfo";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import ChatLoading from "../Loading/ChatLoading";
import UserChatItem from "../userAvatar/UserChatItem";
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import '../../styles/SideBar.css'


function SideBar() {
  const { user, chats,setChats,selectedChat,setSelectedChat,notification,setNotification} = ChatState();
  const [showProfile, setShowProfile] = useState(false);
  const [results,setresults]=useState([]);
  const [search,setsearch]=useState(null);
  const [isLoading,setLoading] =useState(false);
  const handleClose = () => setShowProfile(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
   const handleClickUser= async (userId)=>{
    const config={
      headers:{
        "Content-type": "application/json",
        authorization:`Bearer ${user.token}`
      }
    }
    console.log(user.token)
    setLoading(true);
    const { data } = await axios.post('http://localhost:3000/api/chat', { userId }, config);

    if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
    setSelectedChat(data);
    console.log(data);
    setLoading(false);
    const offcanvasElement = document.getElementById("offcanvasSearch");
    if (offcanvasElement) {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement) || 
                                 new bootstrap.Offcanvas(offcanvasElement);
      offcanvasInstance.hide();
    }
  }
  async function  handleSearch(e){
    if(e.length==0)return;
    setsearch(e);
    const config={
      headers:{
        authorization:`Bearer ${user.token}`
      }
    }
    console.log(user.token)
    setLoading(true);
    const {data}=await axios.get(`http://localhost:3000/api/user?search=${search}`,config);
    setresults(data);
    console.log(data);
    setLoading(false);
  } 
  const getUser = (loggedUser, users) =>
    users[0]._id === loggedUser._id ? users[1].name : users[0].name;

  

  return (
    <>
    
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo03"
            aria-controls="navbarTogglerDemo03"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <form className="d-flex" role="search">
            <button
              className="btn btn-outline-success"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasSearch"
              aria-controls="offcanvasSearch"
            >
              Search
            </button>
          </form>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
            {/* Centered Chatting App */}
            

            {/* Right-Aligned Notifications and Profile */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
                <a
                  className="nav-link"
                  href="#"
                  id="notificationDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <NotificationBadge   className="notification-badge" count={notification.length} effect={Effect.SCALE} />
                  <FontAwesomeIcon
                    icon={faBell}
                    size="lg"
                    style={{ marginTop: "10px", marginRight: "20px" }}
                  />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="notificationDropdown"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {notification.length > 0 ? (
                    notification.map((notifi) => (
                      <li key={notifi._id}>
                        <button
                          className="dropdown-item"
                          onClick={() =>{
                            setSelectedChat(notifi.chat);
                            setNotification(notification.filter((n)=>n!==notifi));
                          }}
                        >
                          {notifi.chat.isGroupChat?(<p> new notification from {notifi.chat.chatName}</p>):(<p>new notification from {getUser(user,notifi.chat.users)}</p>)}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span className="dropdown-item">No Notifications</span>
                    </li>
                  )}
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user.pic}
                    alt="User Avatar"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setShowProfile(true)}
                    >
                      View Profile
                    </button>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </a>
                  </li>
                </ul>

                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setShowProfile(true)}
                    >
                      View Profile
                    </button>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </a>
                  </li>
                </ul>



              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Side Drawer (Offcanvas) */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasSearch"
        aria-labelledby="offcanvasSearchLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasSearchLabel">
            Search
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {/* Add your search content or inputs here */}
          <div>
  <input
    type="text"
    className="form-control mb-3"
    placeholder="Type to search..."
    onChange={(e) => handleSearch(e.target.value)} // Corrected parenthesis here
  />
  <button className="btn btn-primary" onClick={() => handleSearch(search)}>
    Search
  </button>
</div>


{isLoading ? (
  <ChatLoading />
) : search!=null&&results.length === 0 ? (
  <div className="text-center">
    <p>No users found</p>
  </div>
) : (
  results.map(user => (
    <div key={user._id}>
      <UserChatItem 
        user={user}
        handleFunction={() => handleClickUser(user._id)}
      />
    </div>
  ))
)}


                
        </div>
      </div>

      {/* Modal for Profile Info */}
      {showProfile && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
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
                <ProfileInfo user={user} />
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
    </>
  );
}

export default SideBar;
