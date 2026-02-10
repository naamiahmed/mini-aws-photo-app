import axios from 'axios';

const API_BASE = "http://localhost:5001/api"; // Backend running in Docker

export const getPhotos = () => axios.get(`${API_BASE}/photos`);
export const generateUploadURL = (filename) => 
    axios.post(`${API_BASE}/generate-presigned-url`, { filename });
export const savePhoto = (photo) => axios.post(`${API_BASE}/save-photo`, photo);
