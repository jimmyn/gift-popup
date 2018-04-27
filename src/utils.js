import axios from 'axios';

const api = axios.create();
api.interceptors.response.use(res => res.data);

export const frontApi = api;

export const resizeImage = (src, size = 500) => {
  const tmp = src.split('.');
  tmp[tmp.length - 2] += `_${size}x`;
  return tmp.join('.');
};
