const Folder = require("../models/folder");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");

exports.createFolder = async (req, res) => {
  try {
    const { name, parentId, tags = [] } = req.body;

    let path = name;

    if (parentId) {
      const parentFolder = await Folder.findById(parentId);
      if (!parentFolder) {
        return res.status(404).json({ error: "Parent folder not found" });
      }
      path = `${parentFolder.path}/${name}`;
    }

    const newFolder = new Folder({
      _id: uuidv4(), 
      name,
      parentId: parentId || null,
      path,
      tags,
    });

    await newFolder.save();

    if (parentId) {
      await Folder.findByIdAndUpdate(parentId, {
        $push: { children: newFolder._id },
      });
    }

    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllParentFolders = async (req, res) => {
  try {
    const parentFolders = await Folder.find({ parentId: null });

    if (parentFolders.length === 0) {
      return res.status(404).json({ message: 'No parent folders found.' });
    }

    res.status(200).json(parentFolders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFolderContents = async (req, res) => {
  try {
    const folderId = req.params.id;

    const folder = await Folder.findById(folderId)
      .populate("children")
      .populate("files");

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const { name, parentId, tags } = req.body;

    let folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    let newPath = name || folder.name;

    if (parentId && parentId !== folder.parentId) {
      const newParent = await Folder.findById(parentId);
      if (!newParent) {
        return res.status(404).json({ error: "New parent folder not found" });
      }
      newPath = `${newParent.path}/${name || folder.name}`;
      folder.parentId = parentId;
    } else {
      newPath = folder.path.split("/").slice(0, -1).join("/") + `/${name}`;
    }

    folder.name = name || folder.name;
    folder.path = newPath;
    folder.tags = tags || folder.tags; 

    await folder.save();

    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const deleteChildFolders = async (folder) => {
      const children = await Folder.find({ parentId: folder._id });

      for (let child of children) {
        await deleteChildFolders(child);
      }

      await File.deleteMany({ folderId: folder._id });
      await Folder.findByIdAndDelete(folder._id);
    };

    await deleteChildFolders(folder);

    await File.deleteMany({ folderId });
    await Folder.findByIdAndDelete(folderId);

    res
      .status(200)
      .json({ message: "Folder and its contents deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};