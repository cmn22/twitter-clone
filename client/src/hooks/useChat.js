/* eslint-disable prettier/prettier */
import { useQuery } from 'react-query';

import axios from '../utils/axios';
import { API_BASE_URL } from '../utils/config';

const getChatById = async (chatId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/chat/${chatId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

const useChat = (chatId) => {
  return useQuery(['chat', chatId], () => getChatById(chatId), {
    refetchOnWindowFocus: true,
  });
};

export default useChat;
