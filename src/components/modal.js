import { React } from 'react';
import '../App.css';
import { Camera } from 'lucide-react';

function Modal({ currentPost, setCurrentPost, savePost, closeModal }) {
  const handleOutsideClick = (event) => {
    if (event.target.classList.contains('Modal')) {closeModal()}
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentPost({ ...currentPost, mediaName: file.name, media: reader.result, mediaType: file.type });
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      const videoURL = URL.createObjectURL(file);
      setCurrentPost({ ...currentPost, mediaName: file.name, media: videoURL, mediaType: file.type });
    }
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
  
  return (
    <div className="Modal"  onClick={handleOutsideClick}>
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
          <button style={{margin:'5px'}} onClick={addTag}>+ Add Tag</button>
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