import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function FolderList({ folders, addFolder }) {
  const [folderName, setFolderName] = useState('');

  const handleAddFolder = () => {
    if (folderName.trim()) {
      addFolder(folderName);
      setFolderName('');
    }
  };

  return (
    <div className="folder-list">
      <h2>Folders</h2>
      <ul>
        {folders.map((folder) => (
          <li key={folder.id}>
            <Link to={`/folder/${folder.id}`}>{folder.name}</Link>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="Add new folder"
      />
      <button onClick={handleAddFolder}>Add Folder</button>
    </div>
  );
}

export default FolderList;