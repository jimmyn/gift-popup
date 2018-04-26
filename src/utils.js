export const fetchJSON = url => fetch(url).then(res => res.json());
export const resizeImage = (src, size = 500) => {
  const tmp = src.split('.');
  tmp[tmp.length - 2] += `_${size}x`;
  return tmp.join('.');
};
