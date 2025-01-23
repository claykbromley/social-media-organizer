import React, { useState } from 'react';

function PostForm({ folders, setFolders }) {
  const [postUrl, setPostUrl] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [tags, setTags] = useState('');

  const handleSavePost = () => {
    if (!postUrl || !selectedFolder) return;

    const newPost = { id: Date.now(), url: postUrl, tags: tags.split(',').map((tag) => tag.trim()) };
    const updatedFolders = folders.map((folder) => {
      if (folder.id === parseInt(selectedFolder)) {
        return { ...folder, posts: [...folder.posts, newPost] };
      }
      return folder;
    });

    setFolders(updatedFolders);
    localStorage.setItem('folders', JSON.stringify(updatedFolders));
    setPostUrl('');
    setTags('');
    setSelectedFolder('');
  };

  return (
    <div className="post-form">
      <h2>Add Post</h2>
      <input
        type="text"
        value={postUrl}
        onChange={(e) => setPostUrl(e.target.value)}
        placeholder="Post URL"
      />
      <select value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)}>
        <option value="">Select Folder</option>
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>{folder.name}</option>
        ))}
      </select>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
      />
      <button onClick={handleSavePost}>Save Post</button>
    </div>
  );
}

export default PostForm;