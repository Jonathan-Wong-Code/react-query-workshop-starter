import axios from 'axios';
import React, { createContext, useContext, useReducer } from 'react';

const PostStateContext = createContext();
const PostDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_POST_SUCCESS': {
      return {
        ...state,
        posts: [...state.posts, action.post],
        isCreateLoading: false,
      };
    }

    case 'CREATE_POST_LOADING': {
      return { ...state, isCreateLoading: true };
    }

    case 'CREATE_POST_ERROR': {
      return {
        ...state,
        isCreateLoading: false,
        isCreateError: true,
        createError: action.error,
      };
    }

    case 'UPDATE_POST_SUCCESS': {
      const newPosts = state.posts.map((post) =>
        post.id === action.post.id ? action.post : post
      );

      return {
        ...state,
        posts: newPosts,
        isUpdateLoading: false,
        isUpdateSuccess: true,
      };
    }

    case 'UPDATE_POST_ERROR': {
      return { ...state, isUpdateError: true, isUpdateLoading: false };
    }

    case 'UPDATE_POST_LOADING': {
      return { ...state, isUpdateLoading: true };
    }

    case 'DELETE_POST_SUCCESS': {
      const newPosts = state.posts.filter((post) => post.id !== action.id);
      return { ...state, posts: newPosts, isDeleteLoading: false };
    }

    case 'DELETE_POST_ERROR': {
      return { ...state, isDeleteLoading: false, isDeleteError: true };
    }

    case 'GET_POSTS_SUCCESS': {
      return { ...state, posts: action.posts, isGetPostsLoading: false };
    }

    case 'GET_POSTS_LOADING': {
      return { ...state, isGetPostsLoading: true };
    }

    case 'GET_POSTS_ERROR': {
      return { ...state, isGetPostLoading: false, isGetPostsError: true };
    }

    default: {
      return state;
    }
  }
};

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    posts: [],
    isGetPostsLoading: true,
  });

  const memoState = React.useMemo(() => state, [state]);

  return (
    <PostStateContext.Provider value={memoState}>
      <PostDispatchContext.Provider value={dispatch}>
        {children}
      </PostDispatchContext.Provider>
    </PostStateContext.Provider>
  );
};

export const usePostState = () => {
  const context = useContext(PostStateContext);
  if (!context) {
    throw new Error('Must use this context within the Post Provider');
  }

  return context;
};

export const usePostDispatch = () => {
  const dispatch = useContext(PostDispatchContext);
  if (!dispatch) {
    throw new Error('Must use this context within the Post Provider');
  }

  return dispatch;
};

export const createPost = async (postData, postDispatch) => {
  postDispatch({ type: 'CREATE_POST_LOADING' });
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}`,
      postData
    );

    postDispatch({ type: 'CREATE_POST_SUCCESS', post: response.data.post });
  } catch (error) {
    postDispatch({
      type: 'CREATE_POST_ERROR',
      error: error.response.data.message,
    });
  }
};

export const updatePost = async (postData, postDispatch) => {
  postDispatch({ type: 'UPDATE_POST_LOADING' });
  try {
    const post = await axios.put(
      `${process.env.REACT_APP_API_URL}/${postData.id}`,
      postData
    );

    postDispatch({ type: 'UPDATE_POST_SUCCESS', post });
  } catch (error) {
    postDispatch({ type: 'UPDATE_POST_ERROR', error });
  }
};

export const deletePost = async (id, postDispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/${id}`);
    postDispatch({ type: 'DELETE_POST_SUCCESS', id });
  } catch (error) {
    postDispatch({ type: 'DELETE_POST_ERROR', error });
  }
};

export const getPosts = async (postDispatch) => {
  postDispatch({ type: 'GET_POSTS_LOADING' });
  try {
    const posts = await axios.get(`${process.env.REACT_APP_API_URL}`);
    postDispatch({ type: 'GET_POSTS_SUCCESS', posts: posts.data.posts });
  } catch (error) {
    postDispatch({ type: 'GET_POSTS_ERROR', error });
  }
};

