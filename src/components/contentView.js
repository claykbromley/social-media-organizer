import React from 'react';
import '../App.css';

function ContentView({ folderContents, openModal, deletePost, selectedFolder, setTagFilter, setShowTags }) {
  return (
    <div className="ContentView">
      {selectedFolder? (
        <>
          <div className='folder-header'>
            <h3 style={{justifySelf:'center'}}>Contents of {selectedFolder}</h3>
            <div style={{display:'flex', justifyContent:'center'}}>
              <button onClick={() => openModal()}>+ New Post</button>
            </div>
          </div>
          <div className='folder-body'>
            <ul>
              {folderContents.map((post, index) => (
                <div className='folder-posts'>
                  <li key={index}>
                    <div style={{display:'flex', justifyContent:'center'}}>
                      <strong>{post.title}</strong>
                    </div>
                    <div style={{display:'flex', gap:'10px', alignItems:"center", justifyContent:'center', margin:'5px'}}>
                      <p style={{margin:'0'}}>tags: </p>
                      {post.tags.map((tag) => 
                        <button className='post-tags' onClick={() => {setTagFilter(tag); setShowTags(true)}}>{tag}</button>)}
                    </div>
                    <div style={{display:'flex', justifyContent:'center'}}>
                      <p>{post.content}</p>
                    </div>
                    {post.image &&
                      <div style={{display:'flex', justifyContent:'center', marginBottom:'20px'}}>
                        <img src={post.image} alt="Preview" style={{ maxWidth:'50%' }}/>
                      </div>}
                    <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
                      <button onClick={() => openModal(post, index)}>Edit</button>
                      <button onClick={() => deletePost(index)}>Delete</button>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </>
      ):<h3 style={{justifySelf:'center'}}>No Folder Selected</h3>}
    </div>
  );
}

export default ContentView;