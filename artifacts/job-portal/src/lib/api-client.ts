export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  const url = typeof input === "string" && !input.startsWith("/api") ? `/api${input}` : input;
  const res = await fetch(url, init);
  return res;
}

export default apiFetch;
