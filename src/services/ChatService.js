import axios from "axios";

export const sendMessageToAI = async (message) => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/chat`, {
    message,
  });
  return res.data;
};
