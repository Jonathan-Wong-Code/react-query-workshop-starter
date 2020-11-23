import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = ({ post, onButtonClick }) => {
  const [loading, setLoading] = React.useState();

  return (
    <div>
      <h3>
        <Link to={`/post/${post.id}`}>{post.title}</Link>
      </h3>
      <p>Created on: {new Date(post.createdAt).toLocaleDateString()}</p>
      <button
        onClick={async () => {
          setLoading(true);
          await onButtonClick();
          setLoading(false);
        }}
      >
        Delet{loading ? 'ing' : 'e'} post
      </button>
    </div>
  );
};

export default PostItem;
