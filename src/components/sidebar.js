import React from 'react';
import '../App.css';

function Sidebar({ folders, createFolder, deleteFolder, setSelectedFolder, selectedFolder, showTags, allTags, filterByTag, tagFilter }) {
  return (
    <div className="Sidebar">
      <h3 style={{justifySelf:'center', marginBottom:'5px'}}>Folders</h3>
      <div style={{display:'flex', justifyContent:'center'}}>
        <button style={{marginBottom:'5px'}} onClick={createFolder}>+ New Folder</button>
      </div>
      <div className="folder-list">
        <ul>
          {Object.keys(folders).map(folderName => (
            <li key={folderName} className={selectedFolder === folderName && !showTags ? 'active' : ''}>
              <span onClick={() => setSelectedFolder(folderName)}>{folderName}</span>
              <button style={{marginRight:'10px'}} onClick={() => deleteFolder(folderName)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <hr></hr>
      <h3 style={{justifySelf:'center', marginTop:'20px', marginBottom:'5px'}}>Tags</h3>
      <div className="tags-list">
        <ul>
          {allTags.map(tag => (
            <li key={tag} className={tagFilter === tag && showTags ? 'active' : ''}>
              <span onClick={() => filterByTag(tag)}>{tag}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;