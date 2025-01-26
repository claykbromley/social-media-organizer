import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000"; // Flask server URL

// Axios instance for API calls
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const registerUser = (username, password) =>
  {api.post("/register", { username, password })};

export const loginUser = (username, password) =>
  api.post("/login", { username, password });

// post folder endpoints
export const fetchFolder = () => api.get("/folder");

export const createFolder = async (folderName) => {
  const response = await axios.post(
    "http://127.0.0.1:5000/folders",
    { folderName },
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true,
    }
  );
  console.log("Folder created:", response.data);
}

export const updateFolder = (postId, updatedData) =>
  api.put(`/folder/${postId}`, updatedData);

export const deleteFolder = async (folderName) => {
  const response = await axios.delete(
    "http://127.0.0.1:5000/folders/"+String(folderName),
    { folderName },
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true,
    }
  );
  console.log("Folder deleted:", response.data);
};
