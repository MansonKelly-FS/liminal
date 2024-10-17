import axios from "axios";

  const API_URL =
    process.env.NODE_ENV === "development"
      ? `http://localhost:6060/api`
      : process.env.REACT_APP_BASE_URL;

const getFiles = async (folderId) => {
    const response = await axios.get(`${API_URL}/api/folders/${folderId}`);
    return response.data;

};

const getFileById = async (fileId) => {
  const response = await axios.get(`${API_URL}/api/files/${fileId}`);
  return response.data;
};

const createFile = async (folderId, fileData) => {
  const response = await axios.post(
    `${API_URL}/api/files`,
    { folderId, ...fileData });
  return response.data;
};

const updateFile = async (fileId, updatedFile) => {
  const response = await axios.put(`${API_URL}/api/files/${fileId}`, updatedFile);
  return response.data;
};

const deleteFile = async (fileId) => {
  const response = await axios.delete(`${API_URL}/api/files/${fileId}`);
  return response.data;
};

const fileService = {
  getFiles,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
};

export default fileService;
