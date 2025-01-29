import axios from "axios";

//const API_BASE_URL = "http://3.14.144.187:5001";
const API_BASE_URL = "http://127.0.0.1:5000";

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
export const registerUser = async (username, password, setIsRegister) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/register`,
      { username, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    console.log("Registration successful:", response.data);
    alert("Registration successful! You can now log in.");
    setIsRegister(false);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    alert("Username already exists!");
  };
};

export const loginUser = (username, password) =>
  api.post("/login", { username, password });

// Folder endpoints
export const fetchFolder = async (setFolders) => {
  const response = await axios.get(
    String(API_BASE_URL)+"/folders",
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true,
    }
  );
  console.log("Folders fetched:", response.data);
  const newFolders = response.data.reduce((acc, folder) => {
    acc[folder.folderName] = folder.posts;
    return acc;
  }, {});
  setFolders(newFolders);
};

export const createFolder = async (folderName) => {
  const response = await axios.post(
    String(API_BASE_URL)+"/folders",
    { folderName },
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true,
    }
  );
  console.log("Folder created:", response.data);
}

export const deleteFolder = async (folderName) => {
  const response = await axios.delete(
    String(API_BASE_URL)+"/folders/"+String(folderName),
    { folderName },
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true,
    }
  );
  console.log("Folder deleted:", response.data);
};

export const updateFolder = async (selectedFolder, posts) => {
  const response = await axios.put(
    String(API_BASE_URL)+"/folders/"+String(selectedFolder),
    { posts },
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true,
    }
  );
  console.log("Folder updated:", response.data);
};
