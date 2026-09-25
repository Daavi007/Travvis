export function apiUrl(path: string) {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return `http://127.0.0.1:8788${path}`;
  }
  return path;
}
