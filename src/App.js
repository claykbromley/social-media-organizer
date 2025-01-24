import React, { useState } from 'react';
import './App.css';

function App() {
  const [folders, setFolders] = useState({}); // Object to store folders and their contents
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({ title: '', content: '', tags: [] });
  const [editingIndex, setEditingIndex] = useState(null);

  const createFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && !folders[folderName]) {
      setFolders({ ...folders, [folderName]: [] });
    } else if (folders[folderName]) {
      alert('Folder already exists!');
    }
  };

  const deleteFolder = (folderName) => {
    const updatedFolders = { ...folders };
    delete updatedFolders[folderName];
    setFolders(updatedFolders);
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

    setFolders({
      ...folders,
      [selectedFolder]: updatedFolderContents
    });

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
    setFolders({
      ...folders,
      [folderName]: updatedFolderContents
    });
  };

  return (
    <div className="App">
      <Sidebar
        folders={folders}
        createFolder={createFolder}
        deleteFolder={deleteFolder}
        setSelectedFolder={setSelectedFolder}
        selectedFolder={selectedFolder}
      />
      <ContentView
        folderContents={folders[selectedFolder] || []}
        openModal={openModal}
        deletePost={(index) => deletePost(selectedFolder, index)}
        selectedFolder={selectedFolder}
      />
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

// Sidebar Component
function Sidebar({ folders, createFolder, deleteFolder, setSelectedFolder, selectedFolder }) {
  return (
    <div className="Sidebar">
      <h3>Folders</h3>
      <button onClick={createFolder}>+ New Folder</button>
      <ul>
        {Object.keys(folders).map(folderName => (
          <li key={folderName} className={selectedFolder === folderName ? 'active' : ''}>
            <span onClick={() => setSelectedFolder(folderName)}>{folderName}</span>
            <button onClick={() => deleteFolder(folderName)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ContentView Component
function ContentView({ folderContents, openModal, deletePost, selectedFolder }) {
  return (
    <div className="ContentView">
      {selectedFolder && (
        <>
          <h3>{selectedFolder ? `Contents of ${selectedFolder}` : 'No Folder Selected'}</h3>
          <div style={{display:'flex', justifyContent:'center'}}>
            <button onClick={() => openModal()}>+ New Post</button>
          </div>
          <ul>
            {folderContents.map((post, index) => (
              <div className='folder-posts'>
                <li key={index}>
                  <div style={{display:'flex', justifyContent:'center'}}>
                    <strong>{post.title}</strong>
                  </div>
                  <div style={{display:'flex', gap:'10px', alignItems:"center", justifyContent:'center'}}>
                    <p style={{margin:'0'}}>tags: </p>
                    <em>{post.tags.join(', ')}</em>
                  </div>
                  <div style={{display:'flex', justifyContent:'center'}}>
                    <p>{post.content}</p>
                  </div>
                  <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
                    <button onClick={() => openModal(post, index)}>Edit</button>
                    <button onClick={() => deletePost(index)}>Delete</button>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// Modal Component
function Modal({ currentPost, setCurrentPost, savePost, closeModal, addTag, deleteTag }) {
  return (
    <div className="Modal">
      <div className="ModalContent">
        <h3>{currentPost.title ? 'Edit Post' : 'New Post'}</h3>
        <label>Title</label>
        <input
          type="text"
          value={currentPost.title}
          onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
        />
        <label>Content</label>
        <textarea
          value={currentPost.content}
          onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
        />
        <label>Tags</label>
        <div style={{display:'flex', justifyContent:'center'}}>
          <button style={{margin:'5px'}} onClick={addTag}>+ Add Tag</button>
        </div>
        <div className="Tags">
          {currentPost.tags.map((tag, index) => (
            <span key={index} className="Tag">
              {tag} <button onClick={() => deleteTag(tag)}>x</button>
            </span>
          ))}
        </div>
        <div style={{display:'flex', justifyContent:'center'}}>
          <button onClick={savePost}>Save</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default App;
