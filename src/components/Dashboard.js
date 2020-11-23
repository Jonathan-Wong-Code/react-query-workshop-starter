import React, { useLayoutEffect } from 'react';
import PostItem from './PostItem';
import CreatePost from './CreatePost';
import {
  getPosts,
  usePostDispatch,
  usePostState,
  deletePost,
} from '../contexts/posts';
const Dashboard = () => {
  const { posts, isGetPostsError, isGetPostsLoading } = usePostState();

  const dispatch = usePostDispatch();

  useLayoutEffect(() => {
    getPosts(dispatch);
  }, [dispatch]);

  if (isGetPostsLoading) {
    return <div>Loading Posts...</div>;
  }

  if (isGetPostsError) {
    return <div>Error Loading Posts!</div>;
  }

  const onButtonClick = async (id) => {
    await deletePost(id, dispatch);
  };

  return (
    <section style={{ display: 'flex', justifyContent: 'space-between' }}>
      <ul style={{ width: '100%' }}>
        {posts.map((post) => {
          return (
            <li key={post.id}>
              <PostItem
                post={post}
                onButtonClick={() => onButtonClick(post.id)}
              />
            </li>
          );
        })}
      </ul>
      <div style={{ width: '100%' }}>
        <CreatePost />
      </div>
    </section>
  );
};

export default Dashboard;
