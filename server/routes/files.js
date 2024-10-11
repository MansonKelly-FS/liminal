const express = require("express");
const router = express.Router();
const fileController = require("../controllers/files");

router.post("/files", fileController.createFile);

router.get("/files/:id", fileController.getFileById);

router.put("/files/:id", fileController.updateFile);

router.delete("/files/:id", fileController.deleteFile);

module.exports = router;
