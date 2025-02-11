import { React, useState } from 'react';
import '../App.css';
import { Camera } from 'lucide-react';

function Modal({ currentPost, setCurrentPost, savePost, closeModal }) {
  const [createTag, setCreateTag] = useState(false);
  const [newTag, setNewTag] = useState(null);

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains('Modal') && createTag===false) {closeModal()};
  };

  const handleOutsideClickTag = (event) => {
    if (event.target.classList.contains('Modal')) {setCreateTag(false)};
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      if (file.type.startsWith("video/")) {setCurrentPost({ ...currentPost, mediaName: file.name, media: reader.result, mediaType: "video/mp4" })}
      else {setCurrentPost({ ...currentPost, mediaName: file.name, media: reader.result, mediaType: file.type })};
    };
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    if (newTag && !currentPost.tags.includes(newTag)) {
      setCurrentPost({ ...currentPost, tags: [...currentPost.tags, newTag] });
    }
    setCreateTag(false);
  };

  const deleteTag = (tag) => {
    const updatedTags = currentPost.tags.filter(t => t !== tag);
    setCurrentPost({ ...currentPost, tags: updatedTags });
  };
  
  return (
    <div className="Modal"  onClick={handleOutsideClick}>
      <div className="ModalContent">
        <h3 style={{margin:0}}>{currentPost.title ? 'Edit Post' : 'New Post'}</h3>
        <div style={{display:'flex', justifyContent:'center'}}>
          {currentPost.datetime?<p style={{fontSize:'small', margin:0}}>
            Last updated: {currentPost.datetime.toLocaleString('en-US',
            {month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', ' at')}
          </p>:""}
        </div>
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
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <button style={{margin:'0'}}
            onClick={() => document.getElementById('fileInput').click()}><Camera /></button>
          <input
            id="fileInput"
            type="file"
            accept="image/*,video/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          {currentPost.mediaName && 
            <div className='Tags' style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
              <p style={{margin:0, marginLeft:'20px'}}><strong>Selected {currentPost.mediaType.startsWith('image/')?"Image":"Video"}:</strong> {currentPost.mediaName}</p>
              <button onClick={() => setCurrentPost({ ...currentPost, media: null, mediaName: null })}>x</button>
            </div>}
        </div>
        <label>Tags</label>
        <div style={{display:'flex', justifyContent:'center'}}>
          <button style={{margin:'5px'}} onClick={() => setCreateTag(true)}>+ Add Tag</button>
          {createTag && <div className="Modal" onClick={handleOutsideClickTag}>
            <div className="ModalContent">
              <h3 style={{margin:0}}>Add Tag:</h3>
              <input
                type="text"
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={e => e.key==="Enter"?addTag(e):""}
              />
              <div style={{display:'flex', justifyContent:'center', gap:'20px'}}>
                <button onClick={addTag}>Add Tag</button>
                <button onClick={() => setCreateTag(false)}>Cancel</button>
              </div>
            </div>
          </div>}
        </div>
        <div className="Tags">
          {currentPost.tags.map((tag, index) => (
            <span key={index} className="Tag">
              <div style={{display:'flex', alignItems:'center'}}>
                {tag} <button style={{marginLeft:'5px'}} onClick={() => deleteTag(tag)}>x</button>
              </div>
            </span>
          ))}
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:'20px'}}>
          <button onClick={savePost}>Save</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;