import { useMutation } from 'react-query';

import axios from '../utils/axios';
import { API_BASE_URL } from '../utils/config';

const useRepost = () => {
  return useMutation(async ({ postId }) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/post/repost`, {
        postId,
      });
      return data;
    } catch (error) {
      return error;
    }
  });
};

export default useRepost;
