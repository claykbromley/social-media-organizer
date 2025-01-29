import { React, useState } from 'react';
import '../App.css';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import { createFolder, deleteFolder, updateFolder } from "../services/api";

function Sidebar({ folders, setFolders, setSelectedFolder, selectedFolder, showTags, allTags, filterByTag, tagFilter }) {
  const [verifyDelete, setVerifyDelete] = useState(null);

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
    setVerifyDelete(null)
  };

  const renameFolder = (folderName) => {
    const newFolderName = prompt("Enter new folder name:")
    if (newFolderName && !folders[newFolderName]) {
      try{
        createFolder(newFolderName);
        updateFolder(newFolderName, folders[folderName])
        deleteFolder(folderName)
        folders[newFolderName] = folders[folderName];
        delete folders[folderName]
        setSelectedFolder(newFolderName);
      } catch (error) {
        console.error("Error renaming folder:", error);
      }
    } else if (folders[folderName]) {
      alert('Folder name already exists!');
    }
  }

  const [query, setQuery] = useState("");
  const filteredTagList = allTags.filter(tag =>
    tag.toLowerCase().startsWith(query.toLowerCase())
  );

  return (
    <div className="Sidebar">
      <h3 style={{justifySelf:'center', marginBottom:'5px'}}>Folders</h3>
      <div style={{display:'flex', justifyContent:'center'}}>
        <button style={{marginBottom:'5px'}} onClick={newFolder}>+ New Folder</button>
      </div>
      <div className="folder-list">
        <ul>
          {Object.keys(folders).map(folderName => (
            <li key={folderName} className={selectedFolder === folderName && !showTags ? 'active' : ''}>
              <span onClick={() => setSelectedFolder(folderName)}>{folderName.slice(0,25)}</span>
              <div>
                <button style={{marginRight:'10px'}} onClick={() => renameFolder(folderName)}><FaPencilAlt /></button>
                <button style={{marginRight:'10px'}} onClick={() => setVerifyDelete(folderName)}><FaTrash /></button>
                {verifyDelete===folderName && <div className='Modal'>
                  <div className='ModalContent'>
                    <h3 style={{color:'black', marginBottom:'0'}}>Are you sure you want to delete {folderName}?</h3>
                    <div style={{display:'flex', justifyContent:'center', gap:'20px'}}>
                      <button onClick={() => removeFolder(folderName)}>Delete</button>
                      <button onClick={() => setVerifyDelete(null)}>Cancel</button>
                    </div>
                  </div>
                </div>}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <hr></hr>
      <h3 style={{justifySelf:'center', marginTop:'20px', marginBottom:'5px'}}>Tags</h3>
      <div className="tags-list">
        <div style={{display:'flex', justifyContent:'center'}}>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..."/>
        </div>
        <ul>
          {filteredTagList.map(tag => (
            <li key={tag} className={tagFilter === tag && showTags ? 'active' : ''} style={{padding:'0'}}>
              <span onClick={() => filterByTag(tag)}>{tag}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;