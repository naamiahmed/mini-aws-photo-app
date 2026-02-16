import axios from 'axios';

const API_BASE = "http://localhost:5001/api";

// Get all photos
export const getPhotos = () =>
  axios.get(`${API_BASE}/photos`);

// Generate Pre-Signed Upload URL
export const generateUploadURL = (filename, type) =>
  axios.post(`${API_BASE}/generate-upload-url`, {
    filename,
    type
  });

// Save metadata to DB
export const savePhoto = (photo) =>
  axios.post(`${API_BASE}/save-photo`, photo);

// Upload directly to S3
export const uploadToS3 = (url, file) =>
  axios.put(url, file, {
    headers: {
      "Content-Type": file.type
    }
  });
