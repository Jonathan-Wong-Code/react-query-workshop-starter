import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { usePost } from '../utils/posts';

const Post = () => {
  const { id } = useParams();

  const { post, isLoading, isError } = usePost(id);
  if (isLoading) return <div>Loading Post...</div>;
  if (isError) return <div>Error loading post!</div>;

  if (!post) return <div />;
  return (
    <section>
      <h3>{post.title}</h3>
      <p>created: {new Date(post.createdAt).toLocaleDateString()}</p>
      <p>{post.blogPost}</p>
      <Link to={`/editPost/${post.id}`} className='link-button'>
        Edit Post
      </Link>
    </section>
  );
};

export default Post;
