import React from 'react';
import { usePost } from '../utils/posts';
import { updatePost, usePostState, usePostDispatch } from '../contexts/posts';
import PostForm from './PostForm';
import { useHistory, useParams } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams();
  const { post, isLoading, isError } = usePost(id);
  const dispatch = usePostDispatch();
  const { isUpdateLoading, isUpdateError, isUpdateSuccess } = usePostState();
  const history = useHistory();

  React.useLayoutEffect(() => {
    if (isUpdateSuccess) {
      history.push('/');
    }
  }, [isUpdateSuccess, history]);

  const update = async (formData) => {
    await updatePost(formData, dispatch);
  };
  if (isUpdateLoading) return <div>Updating post...</div>;
  if (isLoading) return <div>Loading post...</div>;
  if (isError) return <div>Error finding post to edit.</div>;
  if (!post) return <div />;
  return (
    <div>
      <h2>Edit post</h2>
      <PostForm
        onSubmit={update}
        // error={error}
        isError={isUpdateError}
        originalPost={post}
      />
    </div>
  );
};
export default EditPost;
