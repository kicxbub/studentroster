const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function api(path: string, options?: RequestInit) {
  const url = BASE_URL + path;

  return fetch(url, {
    credentials: "include",
    ...options,
  });
}