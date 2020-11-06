import { useQuery, queryCache, useMutation } from "react-query";
import axios from "axios";

const postsQueryConfig = {
  queryKey: "posts",
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
  queryCache.setQueryData(["post", { postId: post.id }], post);
};

export const usePosts = () => {
  return useQuery(postsQueryConfig);
};

export const usePost = (id) => {
  return useQuery({
    queryKey: ["post", { postId: id }],
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_URL}/${id}`)
        .then((res) => res.data.post),
  });
};

export const useCreatePost = () => {
  return useMutation(
    (formData) =>
      axios
        .post(process.env.REACT_APP_API_URL, formData)
        .then((res) => res.data.post),

    {
      onSuccess: (newItem) => {
        queryCache.setQueryData("posts", (old) => {
          return [...old, newItem];
        });
      },
    }
  );
};

export const useUpdatePost = (id, post) => {
  return useMutation(
    (formData) =>
      axios
        .put(`${process.env.REACT_APP_API_URL}/${id}`, { ...post, ...formData })
        .then((res) => res.data.post),
    {
      //on Success update query cache
      onSuccess: (updatedPost) => {
        queryCache.setQueryData("posts", (oldPosts) => {
          const newPosts = oldPosts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          );
          return newPosts;
        });

        updateQueryForPost(updatedPost);
      },
    }
  );
};

export const useRemovePost = (post) => {
  return useMutation(
    (postId) => axios.delete(`${process.env.REACT_APP_API_URL}/${postId}`),
    {
      onMutate: () => {
        const previousItems = queryCache.getQueryData("posts");

        queryCache.setQueryData("posts", (oldPosts) => {
          return oldPosts.filter((oldPost) => oldPost.id !== post.id);
        });

        return () => queryCache.setQueryData("posts", previousItems);
      },

      onError: (err, vars, recover) => {
        console.log(err);
        recover();
      },

      onSuccess: () => queryCache.invalidateQueries("posts"),
    }
  );
};
