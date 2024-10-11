import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fileService from "../services/file.service";

function NewFile() {
  const { folderId } = useParams();
  const [folder, setFolder] = useState(null);
  const [childrenFolders, setChildrenFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(folderId);

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        if (folderId) {
          console.log("Fetching data for folderId:", folderId);
          const folderResponse = await fileService.getFiles(folderId);
          setFolder(folderResponse);
          setChildrenFolders(folderResponse.children || []);
          setFiles(folderResponse.files || []);
          console.log("Children folders:", folderResponse.children);
          console.log("Files:", folderResponse.files);
        } else {
          console.log("No folderId found");
        }
      } catch (error) {
        console.error("Error fetching folder data:", error);
      }
    };

    fetchFolderData();
  }, [folderId]);

  const navigate = useNavigate();

    const handleFileNameChange = (e) => {
      setFileName(e.target.value);
    };

    const handleFolderChange = (e) => {
      setSelectedFolderId(e.target.value);
    };
  
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  }

    const handleTagKeyPress = (e) => {
      if (e.key === "Enter" && tagInput.trim() !== "") {
        setTags([...tags, tagInput.trim()]);
        setTagInput(""); 
        e.preventDefault(); 
      }
    };

    const removeTag = (indexToRemove) => {
      setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const newFile = {
          name: fileName,
          folderId: selectedFolderId,
          htmlContent: "",
          cssContent: "",
          tags, 
        };
        const response = await fileService.createFile(
          selectedFolderId,
          newFile
        );
        console.log("File created:", response);
      navigate(`/editor/${response._id}`);
      } catch (error) {
        console.error("Error creating file:", error);
      }
    };

  
  return (
    <main>
      <span>
        <line></line> New File
      </span>
      <section className="form">
        {folder ? (
          <>
            <h1>Create a New File</h1>
            <form onSubmit={handleSubmit}>
              <label for="file-name">
                File Name
                <input
                  id="file-name"
                  type="text"
                  placeholder="File Name"
                  value={fileName}
                  onChange={handleFileNameChange}
                />
              </label>
              <label for="folder-select">
                Folder
                <select
                  name="folders"
                  id="folder-select"
                  value={selectedFolderId}
                  onChange={handleFolderChange}
                >
                  <option value={folder._id}>{folder.name}</option>
                  {childrenFolders.map((folder) => (
                    <option value={folder._id}>-- {folder.name}</option>
                  ))}
                </select>
              </label>
              <label htmlFor="tags">
                Tags
                <input
                  type="text"
                  placeholder="Enter a tag and press Enter"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyPress}
                />
              </label>
              <div className="tags-container">
                {tags.map((tag, index) => (
                  <div className="tag" key={index}>
                    <button type="button" onClick={() => removeTag(index)}>
                      {tag}
                    </button>
                  </div>
                ))}
              </div>
              <button type="submit">Create File</button>
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

export default NewFile;
