const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const folderSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  name: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
    ref: "Folder",
    default: null,
  },
  tags: [String ],
  path: {
    type: String,
    required: true,
  },
  children: [
    {
      type: String,
      ref: "Folder",
    },
  ],
  files: [
    {
      type: String,
      ref: "File",
    },
  ],
  fileCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

folderSchema.index({ name: "text", tags: "text" });
folderSchema.index({ tags: 1 });

module.exports = mongoose.model("Folder", folderSchema);