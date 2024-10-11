const File = require("../models/file");
const Folder = require("../models/folder");
const { v4: uuidv4 } = require("uuid");

exports.createFile = async (req, res) => {
  try {
    const { name, folderId, htmlContent = "", cssContent = "", tags = [] } = req.body;

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const newFile = new File({
      _id: uuidv4(),
      name,
      folderId,
      htmlContent,
      cssContent,
      tags, 
    });

    await newFile.save();

    await Folder.findByIdAndUpdate(folderId, {
      $push: { files: newFile._id },
      $inc: { fileCount: 1 },
    });

    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFileById = async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const { name, folderId, htmlContent, cssContent, tags } = req.body;

    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      {
        name,
        folderId,
        htmlContent,
        cssContent,
        tags, 
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({ error: "File not found" });
    }

    res.status(200).json(updatedFile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Remove the file from the folder's files array
    await Folder.findByIdAndUpdate(file.folderId, {
      $pull: { files: fileId },
      $inc: { fileCount: -1 },
    });

    await File.findByIdAndDelete(fileId);

    res.status(200).json({ message: "File deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
