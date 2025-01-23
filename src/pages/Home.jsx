import React, { useState, useEffect } from 'react';
import FolderList from '../components/FolderList';
import PostForm from '../components/PostForm';

function Home() {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const storedFolders = JSON.parse(localStorage.getItem('folders')) || [];
    setFolders(storedFolders);
  }, []);

  const addFolder = (folderName) => {
    const newFolder = { id: Date.now(), name: folderName, posts: [] };
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    localStorage.setItem('folders', JSON.stringify(updatedFolders));
  };

  return (
    <div className="home">
      <h1>My Social Media Organizer</h1>
      <FolderList folders={folders} addFolder={addFolder} />
      <PostForm folders={folders} setFolders={setFolders} />
    </div>
  );
}

export default Home;