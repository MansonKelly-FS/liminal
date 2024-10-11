const express = require("express");
const router = express.Router();
const folderController = require("../controllers/folders");

router.post('/folders', folderController.createFolder);

router.get("/folders", folderController.getAllParentFolders);

router.get('/folders/:id', folderController.getFolderContents);

router.put('/folders/:id', folderController.updateFolder);

router.delete('/folders/:id', folderController.deleteFolder);

module.exports = router;
