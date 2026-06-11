function imageUrl(name) {
  return `/images/${encodeURIComponent(name)}`;
}
export {
  imageUrl as i
};
