import React, { useState } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import FolderItem from "./FolderItem";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:6060/api/search?q=${query}`
      );
        console.log(response.data)
        setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };

  return (
    <div>
      <form className="search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search files or folders..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {results.files && results.files.length > 0 ? (
          results.files.map((file) => (
            <table>
              <h3>Search Results</h3>
              <tbody>
                <FolderItem
                  key={file._id}
                  fileName={file.name}
                  fileId={file._id}
                />
              </tbody>
            </table>
          ))
        ) : (
          <p> </p>
        )}
        {results.folders && results.folders.length > 0 ? (
                  results.folders.map((folder) => (
              <div>              <h3>Search Results</h3>
            <ProjectCard
              key={folder._id}
              folderName={folder.name}
              fileCount={folder.files.length}
              link={`/files/${folder._id}`}
                          />
                          </div>
          ))
        ) : (
          <p> </p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
