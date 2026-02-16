const express = require("express");
const router = express.Router();
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../config/s3");

router.post("/generate-upload-url", async (req, res) => {
  const { filename, type } = req.body;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: filename,
    ContentType: type
  });

  const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });

  res.json({ uploadURL });
});

module.exports = router;
