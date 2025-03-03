import { useInfiniteQuery } from 'react-query';
import { useAuth } from '../contexts/auth-context';

import axios from '../utils/axios';
import { API_BASE_URL } from '../utils/config';

const getNotifications = async ({ pageParam = 1 }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/notification`, {
      params: {
        page: pageParam,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  return useInfiniteQuery('notifications', getNotifications, {
    getNextPageParam: (lastPage) => {
      const { nextPage } = lastPage.info;
      if (nextPage) return nextPage;
      return false;
    },
    enabled: !!isAuthenticated,
    refetchOnWindowFocus: false,
  });
};

export default useNotifications;
