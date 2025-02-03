import React, { useState, useEffect } from 'react';
import './App.css';
import Modal from './components/modal'
import Sidebar from './components/sidebar';
import ContentView from './components/contentView';
import TagView from './components/tagView';
import Login from "./components/login";
import Settings from "./components/settings";
import { fetchFolder, updateFolder, logoutUser } from "./services/api";
import { FaGear } from "react-icons/fa6";

function App() {
  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({ title: '', content: '', tags: [], image: null });
  const [editingIndex, setEditingIndex] = useState(null);
  const [tagFilter, setTagFilter] = useState(null);
  const [showTags, setShowTags] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (user) {
      try {
        fetchFolder(setFolders)
      } catch (error) {
        console.error("Error fetching folders:", error);
      };
    };
  }, [user]);

  const openModal = (post = { title: '', content: '', tags: [] }, index = null) => {
    setCurrentPost(post);
    setEditingIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentPost({ title: '', content: '', tags: [] });
    setEditingIndex(null);
    setModalOpen(false);
  };

  const savePost = () => {
    const newPost = { ...currentPost };
    
    const updatedFolderContents = [...folders[selectedFolder]];
    if (editingIndex !== null) {
      updatedFolderContents[editingIndex] = newPost;
    } else {
      updatedFolderContents.push(newPost);
    }

    try {
      updateFolder(selectedFolder, updatedFolderContents)
      setFolders({
        ...folders,
        [selectedFolder]: updatedFolderContents
      });
    } catch (error) {
      console.error("Error saving post:", error);
    }
    
    closeModal();
  };

  const deletePost = (folderName, index) => {
    const updatedFolderContents = folders[folderName].filter((_, i) => i !== index);
    try {
      updateFolder(folderName, updatedFolderContents)
      setFolders({
        ...folders,
        [folderName]: updatedFolderContents
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const folderClick = (folder) => {
    setSelectedFolder(folder);
    setShowTags(false);
  }

  const filterByTag = (tag) => {
    setShowTags(true);
    setTagFilter(tag);
  };

  const getAllPostsByTag = (tag) => {
    const results = [];
    Object.entries(folders).forEach(([folderName, posts]) => {
      posts.forEach((post) => {
        if (post.tags.includes(tag)) {
          results.push({ folder: folderName, post });
        }
      });
    });
    return results;
  };

  const allTags = Array.from(
    new Set(
      Object.values(folders).flat().flatMap(post => post.tags)
    )
  );

  const filteredPosts = tagFilter
    ? getAllPostsByTag(tagFilter)
    : (folders[selectedFolder] || []).map(post => ({ folder: selectedFolder, post }));


  const logout = () => {
    logoutUser(setUser, setFolders, setSelectedFolder);
    setOpenSettings(false);
  };

  return (
    <div className="App">
      {!user && <Login
        setUser={setUser}
      />}
      <Sidebar
        folders={folders}
        setFolders={setFolders}
        setSelectedFolder={folderClick}
        selectedFolder={selectedFolder}
        showTags={showTags}
        allTags={allTags}
        filterByTag={filterByTag}
        tagFilter={tagFilter}
      />
      <button className='settingsButton' onClick={() => setOpenSettings(true)}><FaGear /></button>
      {openSettings && 
        <Settings
          setOpenSettings={setOpenSettings}
          user={user}
          logout={logout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
      />}
      {!showTags &&
      <ContentView
        folderContents={folders[selectedFolder] || []}
        openModal={openModal}
        deletePost={(index) => deletePost(selectedFolder, index)}
        selectedFolder={selectedFolder}
        setTagFilter={setTagFilter}
        setShowTags={setShowTags}
      />}
      {showTags &&
      <TagView
        folderContents={filteredPosts}
        openModal={openModal}
        deletePost={(index) => deletePost(selectedFolder, index)}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        setShowTags={setShowTags}
      />}
      {modalOpen && (
        <Modal
          currentPost={currentPost}
          setCurrentPost={setCurrentPost}
          savePost={savePost}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default App;
