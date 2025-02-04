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
export const registerUser = async (username, password) => {
  try {
    await axios.post(
      `${API_BASE_URL}/register`,
      { username, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return true;
  } catch {
    return false;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/login`,
      { username, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    const accessToken = response.data.access_token;
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      console.log("Logged in! Token saved.");

      localStorage.setItem('darkMode', response.data.dark_mode ? "enabled" : "disabled");
      if (response.data.dark_mode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }

      return true;
    }
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

export const logoutUser = async (setUser, setFolders, setSelectedFolder) => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error("No access token found.");
            return;
        }
        await axios.post('http://localhost:5000/logout', {}, {
            headers: {
                Authorization: `Bearer ${token}`  // Make sure "Bearer " is included
            }
        });
        localStorage.removeItem('access_token'); // Clear stored token after logout
        console.log("Logged out successfully");
        setUser(null);
        setFolders({});
        setSelectedFolder(null);
    } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
    }
};


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

export const toggleDarkMode = async () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");

  try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      await axios.post(`${API_BASE_URL}/update-dark-mode`, 
          { dark_mode: isDarkMode }, 
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            withCredentials: true
          }
      );
      console.log("Dark mode preference updated in backend");
  } catch (error) {
      console.error("Failed to update dark mode:", error.response?.data || error.message);
  }
};
