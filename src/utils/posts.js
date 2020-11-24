import axios from 'axios';
import { useState, useEffect } from 'react';
import { usePostState } from '../contexts/posts';

export const usePost = (postId) => {
  const { posts } = usePostState();

  const [state, setState] = useState({
    isLoading: false,
    isError: false,
  });

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/${postId}`
        );

        setState({ isSuccess: true, post: res.data.post });
      } catch (error) {
        console.log(error);
        setState({ isError: true, error });
      }
    };

    if (posts && posts.length !== 0) {
      const foundPost = posts.find((post) => post.id === postId);
      console.log(foundPost);
      setState({
        isLoading: false,
        post: foundPost,
      });
    } else {
      getPost();
    }
  }, [postId, posts]);

  return state;
};
