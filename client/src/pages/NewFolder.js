import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fileService from "../services/file.service";
import folderService from "../services/folder.service";

function NewFolder() {
    const { folderId } = useParams();
    const [folder, setFolder] = useState(null);
    const [childrenFolders, setChildrenFolders] = useState([]);
    const [folderName, setFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(folderId);
  
    useEffect(() => {
      const fetchFolderData = async () => {
        try {
          if (folderId) {
            console.log("Fetching data for folderId:", folderId);
            const folderResponse = await fileService.getFiles(folderId);
            setFolder(folderResponse);

            setChildrenFolders(folderResponse.children || []);
            console.log("Children folders:", folderResponse.children);
          } else {
            console.log("No folderId provided.")
          }
        } catch (error) {
          console.error("Error fetching folder data:", error);
        }
      };

      fetchFolderData();
    }, [folderId]);
  
    const navigate = useNavigate();

    const handleFolderNameChange = (e) => {
      setFolderName(e.target.value);
    };

    const handleFolderChange = (e) => {
      setSelectedFolderId(e.target.value);
    };
  
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const newFolder = {
            name: folderName,
            parentId: selectedFolderId
          };
          const response = await folderService.createFolder(
            newFolder
          );
          console.log("Folder created:", response);
          navigate(`/files/${response._id}`);
        } catch (error) {
          console.error("Error creating file:", error);
        }
      };
  
  return (
    <main>
      <span>
        <line></line> New Folder
      </span>
      <section className="form">
        {folder ? (
          <>
            <h1>Create a New Folder</h1>
            <form onSubmit={handleSubmit}>
              <label for="folder-name">
                Folder Name
                <input
                  id="folder-name"
                  type="text"
                  placeholder="Folder Name"
                  value={folderName}
                  onChange={handleFolderNameChange}
                />
              </label>
              <label for="folder-select">
                Parent Folder
                <select
                  name="folders"
                  id="folder-select"
                  value={selectedFolderId}
                  onChange={handleFolderChange}
                >
                  <option value="">None</option>
                  <option value={folder._id}>{folder.name}</option>
                  {childrenFolders.map((folder) => (
                    <option value={folder._id}>-- {folder.name}</option>
                  ))}
                </select>
              </label>
              <button type="submit">Create Folder</button>
            </form>
          </>
        ) : (
          <>
              <h1>Create a New Folder</h1>
            <form onSubmit={handleSubmit}>
              <label for="folder-name">
                Folder Name
                <input
                  id="folder-name"
                  type="text"
                  placeholder="Folder Name"
                  value={folderName}
                  onChange={handleFolderNameChange}
                />
              </label>
              <label for="folder-select">
                Parent Folder
                <select
                  name="folders"
                  id="folder-select"
                  value={selectedFolderId}
                  onChange={handleFolderChange}
                >
                  <option value="">None</option>
                  {childrenFolders.map((folder) => (
                    <option value={folder._id}>-- {folder.name}</option>
                  ))}
                </select>
              </label>
              <button type="submit">Create Folder</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

export default NewFolder;
