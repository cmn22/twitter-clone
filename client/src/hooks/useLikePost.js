import { useMutation } from 'react-query';

import axios from '../utils/axios';
import { API_BASE_URL } from '../utils/config';

const useLikePost = () => {
  return useMutation(async ({ postId }) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/post/like`, {
        postId,
      });
      return data;
    } catch (error) {
      return error;
    }
  });
};

export default useLikePost;
