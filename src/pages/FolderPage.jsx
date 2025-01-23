import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';

function FolderPage() {
  const { folderId } = useParams();
  const [folder, setFolder] = useState(null);

  useEffect(() => {
    const storedFolders = JSON.parse(localStorage.getItem('folders')) || [];
    const currentFolder = storedFolders.find((f) => f.id === parseInt(folderId));
    setFolder(currentFolder);
  }, [folderId]);

  if (!folder) return <h2>Folder not found</h2>;

  return (
    <div className="folder-page">
      <h1>{folder.name}</h1>
      <div className="posts">
        {folder.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default FolderPage;