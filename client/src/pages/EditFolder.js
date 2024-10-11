import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import folderService from "../services/folder.service";
import fileService from "../services/file.service";

function EditFolder() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(folderId);
      const [childrenFolders, setChildrenFolders] = useState([]);
  
  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        if (folderId) {
          console.log("Fetching data for folderId:", folderId);
          const folderResponse = await folderService.getFolderById(folderId);
                 const childrenFolderResponse = await fileService.getFiles(folderId);
                 setFolder(folderResponse);
                 setChildrenFolders(childrenFolderResponse.children || []);
                 console.log("Children folders:", childrenFolderResponse.children);
          setFolder(folderResponse);
          setFolderName(folderResponse.name);
          console.log("Folder:", folderResponse);
        } else {
          console.log("No folderId found");
        }
      } catch (error) {
        console.error("Error fetching folder data:", error);
      }
    };

    fetchFolderData();
  }, [folderId]);

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

    const handleFolderChange = (e) => {
      setSelectedFolderId(e.target.value);
    };
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedFolder = {
        ...folder,
        name: folderName,
        parentId: selectedFolderId
      };
      const response = await folderService.updateFolder(
        updatedFolder
      );
      console.log("Folder updated:", response);
      alert("Folder updated");
      navigate(`/files/${folderId}`); 
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  };

    const handleDelete = async () => {
      try {
        if (folderId) {
          await folderService.deleteFolder(folderId);
          console.log("Folder deleted");
          alert("Folder deleted");
          navigate("/dashboard"); 
        }
      } catch (error) {
        console.error("Error deleting folder:", error);
      }
    };
  
  
  return (
    <main>
      <span>
        <line></line> Edit Folder
      </span>
      <section className="form">
        {folder ? (
          <>
            <h1>Edit Folder</h1>
            <form onSubmit={handleUpdate}>
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
              <button type="submit">Update Folder</button>
              <Link to="#" onClick={handleDelete}>
                delete
              </Link>
            </form>
          </>
        ) : (
          <div>
            Hmm..... Something is amiss. Please navigate away from this page.
          </div>
        )}
      </section>
    </main>
  );
}

export default EditFolder;
