import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import fileService from "../services/file.service";
import folderService from "../services/folder.service";

import { format } from "date-fns";
const formatDate = (dateString) => {
  return format(new Date(dateString), "PPpp");
};

const Editor = () => {
  const { fileId } = useParams();
  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [cssContent, setCssContent] = useState("");
  const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
  const [folderId, setFolderId] = useState(""); 
  const [folders, setFolders] = useState([]); 

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        if (fileId) {
          console.log("Fetching data for fileId:", fileId);
          const fileResponse = await fileService.getFileById(fileId);
          setFile(fileResponse);
          setHtmlContent(fileResponse.htmlContent || "");
          setCssContent(fileResponse.cssContent || "");
          setTags(fileResponse.tags || []);
          setFolderId(fileResponse.folderId || ""); 
          console.log("File:", fileResponse);
        } else {
          console.log("No fileId found");
        }
      } catch (error) {
        console.error("Error fetching file data:", error);
      }
    };

    fetchFileData();
  }, [fileId]);

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        const folderResponse = await folderService.getFolders();
        const foldersWithChildren = await Promise.all(
          folderResponse.map(async (folder) => {
            return await fetchChildrenRecursively(folder);
          })
        );
        setFolders(foldersWithChildren);
        console.log("All folders with children:", foldersWithChildren);
      } catch (error) {
        console.error("Error fetching folder data:", error);
      }
    };

    // Recursive function to fetch all children of a folder
    const fetchChildrenRecursively = async (folder) => {
      if (folder.children && folder.children.length > 0) {
        const children = await Promise.all(
          folder.children.map(async (childId) => {
            const childFolder = await folderService.getFolderById(childId);
            return await fetchChildrenRecursively(childFolder);
          })
        );
        folder.children = children;
      }
      return folder;
    };

    fetchFolderData();
  }, []);

  
    const handleHtmlChange = (e) => {
      setHtmlContent(e.target.value);
    };

    const handleCssChange = (e) => {
      setCssContent(e.target.value);
    };
  
  

  const handleFolderChange = async (e) => {
    const newFolderId = e.target.value;
    setFolderId(newFolderId);

    if (file) {
      try {
        const updatedFile = { ...file, folderId: newFolderId };
        await fileService.updateFile(fileId, updatedFile);
        setFile(updatedFile);
        console.log("Folder ID updated:", newFolderId);
      } catch (error) {
        console.error("Error updating folder ID:", error);
      }
    }
  };

  const renderFolderOptions = (folders, prefix = "") => {
    return folders.map((folder) => (
      <React.Fragment key={folder._id}>
        <option value={folder._id}>
          {prefix} {folder.name}
        </option>
        {folder.children && renderFolderOptions(folder.children, `${prefix}--`)}
      </React.Fragment>
    ));
  };
    const handleTagInputChange = (e) => {
      setTagInput(e.target.value);
    };

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

  
const handleSave = async () => {
  try {
    if (fileId) {
      const updatedFile = {
        ...file,
        htmlContent,
        cssContent,
        tags,
      };
      console.log("Saving file with ID:", fileId); // Debugging
      console.log("Updated file data:", updatedFile); // Debugging

      const response = await fileService.updateFile(fileId, updatedFile);
      setFile(response);
      console.log("File saved:", response);
      alert("File saved");
    } else {
      console.error("No fileId found"); // Debugging
    }
  } catch (error) {
    console.error("Error saving file:", error);
  }
};

  const navigate = useNavigate();
  
  const handleDelete = async () => {
      try {
        if (fileId) {
          await fileService.deleteFile(fileId);
          console.log("File deleted");
          alert('File deleted');
      navigate(`/files/${file.folderId}`);
        }
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    };
  
  return (
    <main>
      <span>
        <line></line> Editor
      </span>
      <section>
        {file ? (
          <>
            <h1>{file.name}</h1>
            <small>LAST SAVED: {formatDate(file.updatedAt)}</small>
            <span className="controls">
              <div>
                {" "}
                <select value={folderId} onChange={handleFolderChange}>
                  <option value="">Select a folder</option>
                  {renderFolderOptions(folders)}
                </select>
                <input
                  type="text"
                  placeholder="Enter a tag and press Enter"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyPress}
                />
                <div className="tags-container">
                  {tags.map((tag, index) => (
                    <div className="tag" key={index}>
                      <button type="button" onClick={() => removeTag(index)}>
                        {tag}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {" "}
                <Link to="#" onClick={handleSave}>
                  save
                </Link>{" "}
                /{" "}
                <Link to="#" onClick={handleDelete}>
                  delete
                </Link>
              </div>
            </span>
            <div className="container">
              <aside className="editor">
                <label htmlFor="html">HTML</label>
                <textarea
                  id="html"
                  value={htmlContent}
                  onChange={handleHtmlChange}
                />
                <label htmlFor="css">CSS</label>
                <textarea
                  id="css"
                  value={cssContent}
                  onChange={handleCssChange}
                />
              </aside>
              <div className="preview">
                <style>{`.preview ${cssContent}`}</style>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </div>
            </div>
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

export default Editor;
