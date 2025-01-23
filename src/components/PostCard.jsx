import React from 'react';

function PostCard({ post }) {
  return (
    <div className="post-card">
      <a href={post.url} target="_blank" rel="noopener noreferrer">
        {post.url}
      </a>
      <div className="tags">
        {post.tags.map((tag, index) => (
          <span key={index} className="tag">#{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default PostCard;