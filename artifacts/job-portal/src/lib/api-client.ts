export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  const BASE_API = import.meta.env.VITE_API_BASE_URL || "";
  let url: string;
  
  if (typeof input === "string") {
    url = input.startsWith("http") ? input : `${BASE_API}/api${input}`;
  } else {
    url = input.url.startsWith("http") ? input.url : `${BASE_API}/api${input.url}`;
  }
  
  const finalInit: RequestInit = {
    ...init,
    credentials: "include"
  };
  
  const res = await fetch(url, finalInit);
  return res;
}

export default apiFetch;
