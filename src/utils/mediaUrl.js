/** True if URL should render as <video controls> instead of <img>. */
export function isVideoMediaUrl(src) {
  if (!src || typeof src !== "string") return false;
  const lower = src.split("?")[0].toLowerCase();
  return /\.(mp4|webm|ogg)$/i.test(lower) || /\/video\//i.test(src);
}
