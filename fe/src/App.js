import React, { useState, useEffect } from 'react';
import {
  getPhotos,
  generateUploadURL,
  savePhoto,
  uploadToS3
} from './api';

function App() {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await getPhotos();
      setPhotos(res.data);
    } catch (err) {
      console.error("Error fetching photos:", err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    try {
      // STEP 1 — ask backend for upload permission
      const { data } = await generateUploadURL(
        file.name,
        file.type
      );

      const uploadURL = data.uploadURL;

      // STEP 2 — upload directly to S3
      await uploadToS3(uploadURL, file);

      // STEP 3 — generate public file URL
      const fileURL =
        `https://${process.env.REACT_APP_BUCKET}.s3.${process.env.REACT_APP_REGION}.amazonaws.com/${encodeURIComponent(file.name)}`;

      // STEP 4 — save metadata in DB
      await savePhoto({
        filename: file.name,
        url: fileURL
      });

      alert("Upload successful!");
      fetchPhotos();

    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📸 Photo Uploader</h1>

      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        style={{ marginLeft: 10 }}
      >
        Upload
      </button>

      <h2>Photos</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 10
      }}>
        {photos.map(photo => (
          <div key={photo.id}
            style={{
              border: '1px solid #ccc',
              padding: 5
            }}
          >
            <img
              src={photo.url}
              alt={photo.filename}
              style={{ width: '100%' }}
            />
            <p>{photo.filename}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
