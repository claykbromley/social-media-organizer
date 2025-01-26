import React from 'react';
import '../App.css';
import { Camera } from 'lucide-react';

function Modal({ currentPost, setCurrentPost, savePost, closeModal, addTag, deleteTag }) {
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setCurrentPost({ ...currentPost, image: reader.result, imageName: file.name });
        };
        reader.readAsDataURL(file);
      };
    };
    
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
          <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <button style={{margin:'0', marginRight:'10px'}}
              onClick={() => document.getElementById('fileInput').click()}><Camera /></button>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            {currentPost.imageName && 
              <div className='Tags' style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <p><strong>Selected Image:</strong> {currentPost.imageName}</p>
                <button onClick={() => setCurrentPost({ ...currentPost, image: null, imageName: null })}>x</button>
              </div>}
          </div>
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

export default Modal;