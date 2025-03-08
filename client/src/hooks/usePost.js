import { useQuery } from 'react-query';

import axios from '../utils/axios';
import { API_BASE_URL } from '../utils/config';

const getPostById = async (postId) => {
  try {
    // eslint-disable-next-line prettier/prettier
    const response = await axios.get(`${API_BASE_URL}/api/post/${postId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

const usePost = (postId) => {
  return useQuery(['post', postId], () => getPostById(postId), {
    refetchOnWindowFocus: false,
  });
};

export default usePost;
