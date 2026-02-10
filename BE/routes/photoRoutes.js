const express = require("express");
const router = express.Router();
const controller = require("../controllers/photoController");

router.post("/generate-upload-url", controller.generateUploadUrl);
router.post("/generate-presigned-url", controller.generateUploadUrl);
router.post("/save-photo", controller.savePhoto);
router.get("/photos", controller.getPhotos);

module.exports = router;
