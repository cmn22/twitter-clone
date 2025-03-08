import { useQuery } from 'react-query';

import axios from '../utils/axios';
import { API_BASE_URL } from '../utils/config';

const getUserByUsername = async (username) => {
  // eslint-disable-next-line prettier/prettier
  const { data } = await axios.get(`${API_BASE_URL}/api/users/user/${username}`);
  return data;
};

const useUser = (username) => {
  return useQuery(['user', username], () => getUserByUsername(username), {
    retry: (failureCount, error) => {
      if (error.response?.data?.error?.status === 404) return false;
      return 3;
    },
    refetchOnWindowFocus: false,
  });
};

export default useUser;
