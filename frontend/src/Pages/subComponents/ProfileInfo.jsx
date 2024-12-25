import React from 'react';

function ProfileInfo({ user }) {
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg" style={{ maxWidth: '400px', borderRadius: '20px' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '-60px' }}>
          <img
            src={user.pic}
            alt="Profile"
            className="rounded-circle border border-4 border-light"
            style={{
              height: '180px',
              width: '180px',
              objectFit: 'cover',
              boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
            }}
          />
        </div>
        <div className="card-body text-center">
          <h4 className="card-title">{user.name || 'User Name'}</h4>
          <p className="card-text text-muted">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
