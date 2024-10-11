const File = require("../models/file");
const Folder = require("../models/folder");


exports.searchAll = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    console.log("Search Term:", searchTerm); 

    const textSearchFiles = await File.find({
      $text: { $search: searchTerm },
    }).sort({ score: { $meta: "textScore" } });
    console.log("Text Search Files Found:", textSearchFiles); 

    const textSearchFolders = await Folder.find({
      $text: { $search: searchTerm },
    }).sort({ score: { $meta: "textScore" } });
    console.log("Text Search Folders Found:", textSearchFolders); 

    const regexSearchFiles = await File.find({
      tags: { $regex: searchTerm, $options: "i" },
    });
    console.log("Regex Search Files Found:", regexSearchFiles); 

    const regexSearchFolders = await Folder.find({
      tags: { $regex: searchTerm, $options: "i" },
    });
    console.log("Regex Search Folders Found:", regexSearchFolders); 

    const files = [...textSearchFiles, ...regexSearchFiles];
    const folders = [...textSearchFolders, ...regexSearchFolders];

    res.status(200).json({ files, folders });
  } catch (error) {
    console.error("Error:", error); // Debugging
    res.status(500).json({ message: error.message });
  }
};