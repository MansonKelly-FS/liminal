import React from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ folderName, fileCount, link }) => {
  return (
    <div className="projects-card">
      <h2>
        <Link to={link}>{folderName}</Link>
      </h2>
      <h3>
        <small>{fileCount} files</small>
      </h3>
    </div>
  );
};

export default ProjectCard;
