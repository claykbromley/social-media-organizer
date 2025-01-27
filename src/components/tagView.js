import React from 'react';
import '../App.css';

function TagView({ folderContents, openModal, deletePost, tagFilter, setTagFilter, setShowTags }) {
  return (
    <div className="ContentView">
      <div className='folder-header'>
        <h3 style={{margin:'0'}}>Posts tagged with {tagFilter}</h3>
      </div>
      {folderContents.length > 0 ? (
        <div className='folder-body' style={{marginTop:'46px'}}>
          <ul>
            {folderContents.map(({ folder, post }, index) => (
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
                  <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <small style={{marginRight:'5px'}}>Found in folder: </small>
                    <button className='post-tags' onClick={() => {setShowTags(false)}}>{folder}</button>
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
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default TagView;