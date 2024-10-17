import axios from "axios";

  const API_URL =
    process.env.NODE_ENV === "development"
      ? `http://localhost:6060/api`
      : process.env.REACT_APP_BASE_URL;

const getFolders = async () => {
  const response = await axios.get(`${API_URL}/api/folders`);
  return response.data;
};

const getFolderById = async (folderId) => {
  const response = await axios.get(`${API_URL}/api/folders/${folderId}`);
  return response.data;
};

const createFolder = async (folderData) => {
  const response = await axios.post(`${API_URL}/api/folders`, folderData);
  return response.data;
};

const updateFolder = async (folderId, folderData) => {
  const response = await axios.put(
    `${API_URL}/api/folders/${folderId}`,
    folderData
  );
  return response.data;
};

const deleteFolder = async (folderId) => {
  const response = await axios.delete(`${API_URL}/folders/${folderId}`);
  return response.data;
};

const folderService = {
  getFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
};

export default folderService;
