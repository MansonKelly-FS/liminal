import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import folderService from "../services/folder.service";
import SearchBar from "../components/SearchBar";

function Dashboard() {
  const [folders, setFolders] = React.useState([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const fetchedFolders = await folderService.getFolders();
      setFolders(fetchedFolders);
    };
    fetchFolders();
  }, []); 

  return (
    <main>
      <span>
        <line></line> DASHBOARD
      </span>
      <section>
        <SearchBar />
        <h1>Your dashboard</h1>
        <span>
          <Link to="/dashboard/new">New Folder</Link>
        </span>
        {folders.map((folder) => (
          <ProjectCard
            key={folder._id}
            folderName={folder.name}
            fileCount={folder.files.length}
            link={`/files/${folder._id}`}
          />
        ))}
      </section>
    </main>
  );
}

export default Dashboard;
