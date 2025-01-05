import React from 'react'
import '../../styles/chatLoading.css'
function ChatLoading() {
  return (
    <div className="container mt-5">
      {/* Chat Header Skeleton */}
      

      {/* Chat Messages Skeleton */}
      <div className="skeleton skeleton-text" style={{ width: "100%", height: "50px" }}></div>
      <div className="skeleton skeleton-text" style={{ width: "100%", height: "50px" }}></div>
      <div className="skeleton skeleton-text" style={{ width: "100%", height: "50px" }}></div>
      <div className="skeleton skeleton-text" style={{ width: "100%", height: "50px" }}></div>
      <div className="skeleton skeleton-text" style={{ width: "100%", height: "50px" }}></div>
      <div className="skeleton skeleton-text" style={{ width: "100%", height: "50px" }}></div>
      <div className="skeleton skeleton-text" style={{ width: "100%", height: "50px" }}></div>
      <div className="skeleton skeleton-text" style={{ width: "100%", height: "50px" }}></div>
      <div className="skeleton skeleton-text" style={{ width: "100%", height: "50px" }}></div>
     
 
    </div>
  )
}

export default ChatLoading