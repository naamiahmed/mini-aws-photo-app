const Photo = require("../models/photo");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

exports.generateUploadUrl = async (req, res) => {
  try {
    const { filename, type } = req.body;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: filename,
      ContentType: type,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.json({ uploadURL: uploadUrl });
  } catch (err) {
    console.error("Error generating presigned URL", err);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
};

exports.savePhoto = async (req, res) => {
  const { filename, url } = req.body;

  try {
    const photo = await Photo.create({
      filename,
      url,
    });
    res.json(photo);
  } catch (err) {
    console.error("Error saving photo to DB", err);
    res.status(500).json({ error: "Failed to save photo" });
  }
};

exports.getPhotos = async (req, res) => {
  const photos = await Photo.findAll({
    order: [["createdAt", "DESC"]],
  });

  res.json(photos);
};
