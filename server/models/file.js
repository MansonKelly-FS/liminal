const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const fileSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4, 
  },
  name: {
    type: String,
    required: true,
  },
  folderId: {
    type: String, 
    ref: "Folder",
    required: true,
  },
  tags: [String],
  htmlContent: {
    type: String,
    default: "",
  },
  cssContent: {
    type: String,
    default: "",
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

fileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

fileSchema.index({ name: "text", tags: "text" });
fileSchema.index({ tags: 1 });

module.exports = mongoose.model("File", fileSchema);
