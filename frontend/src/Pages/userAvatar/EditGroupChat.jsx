import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import UserChatItem from './UserChatItem';
import axios from 'axios';

function EditGroupChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupName, setGroupName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const handleRename = async () => {
    if (!groupName) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        'http://localhost:3000/api/chat/rename',
        { chatId: selectedChat._id, chatName: groupName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      alert('Failed to rename the group');
    }
  };

  const handleSearch = async (query) => {
    if (!query) return;
    setSearch(query);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/user?search=${search}`,
        config
      );
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      alert('Failed to search users');
      setLoading(false);
    }
  };

  const handleClickUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      alert('User already in the group');
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      alert('Only the group admin can add users to the group');
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        'http://localhost:3000/api/chat/AddGroup',
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      alert('Error occurred while adding the user');
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert('Only the group admin can remove users');
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        'http://localhost:3000/api/chat/RemoveGroup',
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      if (user1._id === user._id) {
        // If the current user leaves, reset the chat
        setSelectedChat(null);
        window.location.reload();

      } else {
        setSelectedChat(data);
      }
      setFetchAgain(!fetchAgain);
    } catch (error) {
      alert('Error occurred while removing the user');
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Edit Group Chat</h3>

      {/* Group Members */}
      <div className="d-flex flex-wrap mb-4">
        {selectedChat?.users?.map((u) => (
          <div
            key={u._id}
            className="badge bg-primary text-white me-2 mb-2 d-flex align-items-center"
            style={{ padding: '10px', borderRadius: '20px' }}
          >
            <span>{u.name}</span>
            <FontAwesomeIcon
              icon={faTimes}
              size="sm"
              style={{ marginLeft: '8px', cursor: 'pointer' }}
              onClick={() => handleRemove(u)}
            />
          </div>
        ))}
      </div>

      {/* Rename Group */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter New Group Name"
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleRename}>
          Change
        </button>
      </div>

      {/* Search Users */}
      <div className="mb-4">
        <label htmlFor="searchInput" className="form-label">
          Search Users
        </label>
        <input
          type="text"
          id="searchInput"
          className="form-control"
          placeholder="Search users to add"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Search Results */}
      <div>
  {isLoading ? (
    <div className="text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : search!=''&&searchResults.length === 0 ? (
    <div className="text-center">
      <p>No users found</p>
    </div>
  ) : (
    searchResults.slice(0, 4).map((user) => (
      <UserChatItem
        key={user._id}
        user={user}
        handleFunction={() => handleClickUser(user)}
      />
    ))
  )}
</div>


      {/* Leave Group */}
      <div className="text-center mt-4">
        <button className="btn btn-danger" onClick={() => handleRemove(user)}>
          Leave Group
        </button>
      </div>
    </div>
  );
}

export default EditGroupChat;
