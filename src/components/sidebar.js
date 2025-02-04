import { React, useState } from 'react';
import '../App.css';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import { createFolder, deleteFolder, updateFolder } from "../services/api";

function Sidebar({ folders, setFolders, setSelectedFolder, selectedFolder, showTags, allTags, filterByTag, tagFilter }) {
  const [newFolderModal, setNewFolderModal] = useState(false);
  const [folderName, setFolderName] = useState(null);
  const [renameFolderModal, setRenameFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState(null);
  const [verifyDelete, setVerifyDelete] = useState(null);
  const [alreadyExists, setAlreadyExists] = useState(false);

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains('Modal')) {setNewFolderModal(false)}
  };

  const handleOutsideClickRename = (event) => {
    if (event.target.classList.contains('Modal')) {setRenameFolderModal(false)}
  };

  const handleOutsideClickVerifyDelete = (event) => {
    if (event.target.classList.contains('Modal')) {setVerifyDelete(null)}
  };


  const newFolder = async () => {
    if (folderName && !folders[folderName]) {
      try{
        createFolder(folderName);
        setFolders({ ...folders, [folderName]: [] });
        setSelectedFolder(folderName);
        setNewFolderModal(false);
        setAlreadyExists(false);
      } catch (error) {
        console.error("Error creating folder:", error);
      }
    } else if (folders[folderName]) {
      setAlreadyExists(true);
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

  const renameFolder = (folderName, newFolderName) => {
    if (newFolderName && !folders[newFolderName]) {
      try{
        createFolder(newFolderName);
        updateFolder(newFolderName, folders[folderName])
        deleteFolder(folderName)
        folders[newFolderName] = folders[folderName];
        delete folders[folderName]
        setSelectedFolder(newFolderName);
        setRenameFolderModal(false);
        setAlreadyExists(false);
      } catch (error) {
        console.error("Error renaming folder:", error);
      }
    } else if (folders[folderName]) {
      setAlreadyExists(true);
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
        <button style={{marginBottom:'5px'}} onClick={() => {setAlreadyExists(false); setNewFolderModal(true)}}>+ New Folder</button>
        {newFolderModal && <div className="Modal" onClick={handleOutsideClick}>
          <div className="ModalContent">
            <h3 style={{margin:0}}>New Folder Name:</h3>
            {alreadyExists && <h4>Folder Name Alredy Exists!</h4>}
            <input
              type="text"
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={e => e.key==="Enter"?newFolder(e):""}
            />
            <div style={{display:'flex', justifyContent:'center', gap:'20px'}}>
              <button onClick={newFolder}>Create</button>
              <button onClick={() => setNewFolderModal(false)}>Cancel</button>
            </div>
          </div>
        </div>}
      </div>
      <div className="folder-list">
        <ul>
          {Object.keys(folders).map(folderName => (
            <li key={folderName} className={selectedFolder === folderName && !showTags ? 'active' : ''}>
              <span onClick={() => setSelectedFolder(folderName)}>{folderName.slice(0,25)}</span>
              <div>
                <button style={{marginRight:'10px'}}
                  onClick={() => {setNewFolderName(folderName); setAlreadyExists(false); setRenameFolderModal(true)}}>
                  <FaPencilAlt /></button>
                {renameFolderModal && <div className="Modal" onClick={handleOutsideClickRename}>
                  <div className="ModalContent">
                    <h3 style={{margin:0}}>New Folder Name:</h3>
                    {alreadyExists && <h4>Folder Name Alredy Exists!</h4>}
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={e => e.key==="Enter"?renameFolder(folderName, newFolderName):""}
                    />
                    <div style={{display:'flex', justifyContent:'center', gap:'20px'}}>
                      <button onClick={() => renameFolder(folderName, newFolderName)}>Rename</button>
                      <button onClick={() => setRenameFolderModal(false)}>Cancel</button>
                    </div>
                  </div>
                </div>}
                <button style={{marginRight:'10px'}} onClick={() => setVerifyDelete(folderName)}><FaTrash /></button>
                {verifyDelete===folderName && <div className='Modal' style={{zIndex:'1002'}} onClick={handleOutsideClickVerifyDelete}>
                  <div className='ModalContent'>
                    <h3 style={{marginBottom:'0'}}>Are you sure you want to delete {folderName}?</h3>
                    <h3 style={{marginBottom:'0'}}>This action is irreversable!</h3>
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