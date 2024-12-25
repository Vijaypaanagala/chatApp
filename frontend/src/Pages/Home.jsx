import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { useNavigate } from 'react-router-dom';
import SideBar from './subComponents/SideBar';
import MyChats from './subComponents/MyChats';
import ChatBox from './subComponents/ChatBox';
import ProfileInfo from './subComponents/ProfileInfo';

function Home() {
  const {user,selectedChat}=ChatState();
  const navigate=useNavigate();

  if(!user){
    navigate('/Login')
  }
  
  
  const [fetchAgain,setFetchAgain] =useState(false);
  return (
    <div>
    <div>{user && <SideBar />}</div>

    <div className="container-fluid vh-80">
      <div className="row h-100">
        {/* MyChats Section (Left Side) */}
        <div
          className={`col-12 col-md-4 col-lg-3 p-0 border-end ${
            selectedChat ? 'd-none d-md-block' : ''
          }`}
          style={{ overflowY: 'auto' }}
        >
          <MyChats fetchAgain={fetchAgain} />
        </div>

        {/* ChatBox Section (Right Side) */}
        <div
          className={`col-12 col-md-8 col-lg-9 p-0 ${
            selectedChat ? '' : 'd-none d-md-block'
          }`}
          style={{
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            
          />
        </div>
      </div>
    </div>
  </div>
    
    
    
  )
}

export default Home