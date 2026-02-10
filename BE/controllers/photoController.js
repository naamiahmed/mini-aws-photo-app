const Photo = require("../models/photo");

exports.generateUploadUrl = (req, res) => {
  const { filename } = req.body;

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const safeName = encodeURIComponent(filename || "");
  const uploadUrl = `${baseUrl}/uploads/${safeName}`;

  res.json({ url: uploadUrl });
};

exports.savePhoto = async (req, res) => {
  const { filename, url } = req.body;

  const photo = await Photo.create({
    filename,
    url,
  });

  res.json(photo);
};

exports.getPhotos = async (req, res) => {
  const photos = await Photo.findAll({
    order: [["createdAt", "DESC"]],
  });

  res.json(photos);
};
