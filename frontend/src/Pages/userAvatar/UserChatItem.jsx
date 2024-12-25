import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserChatItem({ user,handleFunction }) {
  return (
    <div className="d-flex align-items-center p-2 border-bottom" onClick={handleFunction} style={{cursor:'pointer'}}>
      {/* User Picture */}
      <img
        src={user.pic}
        alt="User Pic"
        className="rounded-circle me-3"
        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
      />

      {/* User Details */}
      <div className="flex-grow-1">
        <h5 className="mb-1 text-truncate" style={{ maxWidth: '200px' }}>
          {user.name}
        </h5>
        <p className="mb-0 text-muted text-truncate" style={{ maxWidth: '200px' }}>
          {user.email}
        </p>
      </div>
    </div>
  );
}

export default UserChatItem;
