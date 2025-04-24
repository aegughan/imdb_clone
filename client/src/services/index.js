export const getApi = async (path) => {
  const baseUrl = "http://localhost:8080";
  return await fetch(`${baseUrl}${path}`).then((res) => {
    if (!res.ok) throw res.response.data;
    return res.json();
  });
};

export const postApi = async (path, data, method = "POST") => {
  const baseUrl = "http://localhost:8080";
  return await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) throw res.response.data;
    return res.json();
  });
};
