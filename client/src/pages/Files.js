import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import fileService from "../services/file.service";
import FolderItem from "../components/FolderItem";
import ProjectCard from "../components/ProjectCard";

import { format } from "date-fns";
const formatDate = (dateString) => {
  return format(new Date(dateString), "PPpp");
};

function Files() {
  const { folderId } = useParams();
  const [folder, setFolder] = useState(null);
  const [childrenFolders, setChildrenFolders] = useState([]);
  const [files, setFiles] = useState([]);


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

    return (
      <main>
        <span>
          <line></line> Files
        </span>
        <section>
          {folder ? (
            <>
              <h1>{folder.name}</h1>
              <span>
                <Link to={`/folder/${folderId}/edit`}>Edit Folder</Link> -
                <Link to={`/folder/${folderId}/new`}>New Folder</Link> -
                <Link to={`/files/${folderId}/new`}>New File</Link>
              </span>
              {childrenFolders.map((folder) => (
                <ProjectCard
                  key={folder._id}
                  folderName={folder.name}
                  fileCount={folder.fileCount}
                  link={`../files/${folder._id}`}
                />
              ))}
              <table>
                <thead>
                  <tr>
                    <th scope="col">File Name</th>
                    <th scope="col">Date Created</th>
                    <th scope="col">Last Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <FolderItem
                      key={file._id}
                      fileName={file.name}
                      dateCreated={formatDate(file.createdAt)}
                      dateEdited={formatDate(file.updatedAt)}
                      fileId={file._id}
                    />
                  ))}
                </tbody>
              </table>
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

export default Files;
