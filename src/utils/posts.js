import { useQuery, queryCache, useMutation } from 'react-query';
import axios from 'axios';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { usePostState } from '../contexts/posts';

const postsQueryConfig = {
  queryKey: 'posts',
  queryFn: () =>
    axios.get(process.env.REACT_APP_API_URL).then((res) => res.data.posts),
  config: {
    onSuccess: (posts) => {
      posts.forEach((post) => {
        updateQueryForPost(post);
      });
    },
  },
};

const updateQueryForPost = (post) => {
  queryCache.setQueryData(['post', { postId: post.id }], post);
};

// export const usePosts = () => {
//   return useQuery(postsQueryConfig);
// };

// export const usePost = (id) => {
//   return useQuery({
//     queryKey: ["post", { postId: id }],
//     queryFn: () =>
//       axios
//         .get(`${process.env.REACT_APP_API_URL}/${id}`)
//         .then((res) => res.data.post),

//     config: {
//       onSuccess: () => {
//         if (!queryCache.getQueryData("posts")) {
//           queryCache.prefetchQuery(postsQueryConfig);
//         }
//       },
//     },
//   });
// };

// export const useCreatePost = () => {
//   return useMutation(
//     (formData) =>
//       axios
//         .post(process.env.REACT_APP_API_URL, formData)
//         .then((res) => res.data.post),

//     {
//       onSuccess: (newItem) => {
//         if (queryCache.getQueryData('posts')) {
//           queryCache.setQueryData('posts', (old) => {
//             return [...old, newItem];
//           });
//         }

//         queryCache.invalidateQueries('posts');
//       },
//     }
//   );
// };

// export const useUpdatePost = (id, post) => {
//   return useMutation(
//     (formData) =>
//       axios
//         .put(`${process.env.REACT_APP_API_URL}/${id}`, { ...post, ...formData })
//         .then((res) => res.data.post),
//     {
//       //on Success update query cache
//       onSuccess: (updatedPost) => {
//         if (queryCache.getQueryData('posts')) {
//           queryCache.setQueryData('posts', (oldPosts) => {
//             const newPosts = oldPosts.map((post) =>
//               post.id === updatedPost.id ? updatedPost : post
//             );
//             return newPosts;
//           });
//         } else {
//           queryCache.setQueryData('posts', [updatedPost]);
//           queryCache.invalidateQueries('posts');
//         }

//         updateQueryForPost(updatedPost);
//       },
//     }
//   );
// };

export const useRemovePost = (post) => {
  return useMutation(
    (postId) => axios.delete(`${process.env.REACT_APP_API_URL}/${postId}`),
    {
      // onMutate: () => {
      //   const previousItems = queryCache.getQueryData("posts");
      //   queryCache.setQueryData("posts", (oldPosts) => {
      //     return oldPosts.filter((oldPost) => oldPost.id !== post.id);
      //   });

      //   return () => queryCache.setQueryData("posts", previousItems);
      // },
      // onError: (err, vars, recover) => {
      //   console.log(err);
      //   recover();
      // },

      onSuccess: () => {
        if (queryCache.getQueryData('posts')) {
          queryCache.setQueryData('posts', (oldPosts) => {
            const newPosts = oldPosts.filter(
              (oldPost) => oldPost.id !== post.id
            );
            return newPosts;
          });
        } else {
          queryCache.setQueryData('posts', []);
          queryCache.invalidateQueries('posts');
        }
      },
    }
  );
};

export const usePosts = () => {
  const [state, setState] = useState({
    posts: [],
    isLoading: true,
    isError: null,
  });

  useEffect(() => {
    const getPosts = async () => {
      setState({ isLoading: true });
      try {
        const data = await axios
          .get(process.env.REACT_APP_API_URL)
          .then((res) => res.data.posts);

        setState({ isSuccess: true, posts: data });
      } catch (error) {
        setState({ isError: true, error });
      }
    };
    getPosts();
  }, []);

  return state;
};

export const usePost = (postId) => {
  const [state, setState] = useState({
    isLoading: true,
    isError: null,
  });

  useEffect(() => {
    const getPost = async () => {
      setState({ isLoading: true });
      try {
        const data = await axios
          .get(`${process.env.REACT_APP_API_URL}/${postId}`)
          .then((res) => res.data.post);

        setState({ isSuccess: true, post: data });
      } catch (error) {
        setState({ isError: true, error });
      }
    };

    getPost();
  }, [postId]);

  return state;
};

export const useCreatePost = () => {
  const [state, setState] = useState({
    isLoading: false,
    isError: false,
    isSuccess: false,
    post: null,
  });

  const mutate = React.useCallback(async (values) => {
    setState({ isLoading: true });
    try {
      const data = await axios
        .post(process.env.REACT_APP_API_URL, values)
        .then((res) => res.data.post);
      setState({ isSuccess: true, post: data });
    } catch (error) {
      setState({ isError: true, error });
    }
  }, []);

  return [mutate, state];
};

export const useUpdatePost = (values) => {
  const [state, setState] = useState({
    isLoading: false,
    isError: false,
    isSuccess: false,
    post: null,
  });

  const mutate = React.useCallback(async (values) => {
    setState({ isLoading: true });
    try {
      const data = await axios
        .put(`${process.env.REACT_APP_API_URL}/${values.id}`, values)
        .then((res) => res.data.post);
      setState({ isSuccess: true, post: data });
    } catch (error) {
      setState({ isError: true, error });
    }
  }, []);

  return [mutate, state];
};

export const useDeletePost = () => {
  const [state, setState] = useState({
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  const mutate = React.useCallback(async (id) => {
    setState({ isLoading: true });
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/${id}`);
      setState({ isSuccess: true });
    } catch (error) {
      setState({ isError: true, error });
    }
  }, []);

  return [mutate, state];
};
