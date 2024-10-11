import React from "react";
import { Link } from "react-router-dom";

const FolderItem = ({ fileName, dateCreated, dateEdited, fileId, tags }) => {
  return (
    <tr>
      <th scope="row">
        <Link to={`/editor/${fileId}`}>
          {fileName}
        </Link>
      </th>
      <td>{dateCreated}</td>
      <td>{dateEdited}</td>
    </tr>
  );
};

export default FolderItem;
