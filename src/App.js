import React, { useState, useEffect } from 'react';
import './App.css';
import Modal from './components/modal'
import Sidebar from './components/sidebar';
import ContentView from './components/contentView';
import TagView from './components/tagView';
import Login from "./components/login";
import { fetchFolder, createFolder, updateFolder, deleteFolder } from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({ title: '', content: '', tags: [], image: null });
  const [editingIndex, setEditingIndex] = useState(null);
  const [tagFilter, setTagFilter] = useState(null);
  const [showTags, setShowTags] = useState(false);

  useEffect(() => {
    if (user) {
      try {
        fetchFolder(setFolders)
      } catch (error) {
        console.error("Error fetching folders:", error);
      };
    };
  }, [user]);

  const newFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && !folders[folderName]) {
      try{
        createFolder(folderName);
        setFolders({ ...folders, [folderName]: [] });
        setSelectedFolder(folderName);
      } catch (error) {
        console.error("Error creating folder:", error);
      }
    } else if (folders[folderName]) {
      alert('Folder already exists!');
    }
  };

  const removeFolder = async (folderName) => {
    try{
      deleteFolder(folderName);
      const updatedFolders = { ...folders };
      delete updatedFolders[folderName];
      setFolders(updatedFolders);
    } catch (error) {
      console.error("Error removing folder:", error);
    }
    if (selectedFolder === folderName) {
      setSelectedFolder(null);
    }
  };

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

  const addTag = () => {
    const newTag = prompt('Enter new tag:');
    if (newTag && !currentPost.tags.includes(newTag)) {
      setCurrentPost({ ...currentPost, tags: [...currentPost.tags, newTag] });
    }
  };

  const deleteTag = (tag) => {
    const updatedTags = currentPost.tags.filter(t => t !== tag);
    setCurrentPost({ ...currentPost, tags: updatedTags });
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
    setShowTags(true)
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

  return (
    <div className="App">
      {!user && <Login
        setUser={setUser}
      />}
      <Sidebar
        folders={folders}
        createFolder={newFolder}
        deleteFolder={removeFolder}
        setSelectedFolder={folderClick}
        selectedFolder={selectedFolder}
        showTags={showTags}
        allTags={allTags}
        filterByTag={filterByTag}
        tagFilter={tagFilter}
      />
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
          addTag={addTag}
          deleteTag={deleteTag}
        />
      )}
    </div>
  );
}

export default App;
