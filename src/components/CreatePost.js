import React from 'react';
import PostForm from './PostForm';
import { createPost, usePostState, usePostDispatch } from '../contexts/posts';
const CreatePost = () => {
  const {
    isCreateLoading: isLoading,
    isCreateError: isError,
    createError: error,
  } = usePostState();

  const dispatch = usePostDispatch();

  const onSubmit = async (formData) => {
    createPost(formData, dispatch);
  };

  if (isLoading) return <div>Creating new post...</div>;
  console.log(isError);
  console.log(error);
  return (
    <section>
      <h2>Create A New Post</h2>

      <PostForm onSubmit={onSubmit} isError={isError} error={error} />
    </section>
  );
};

export default CreatePost;
