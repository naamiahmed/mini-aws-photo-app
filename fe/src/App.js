import React, { useState, useEffect } from 'react';
import { getPhotos, generateUploadURL, savePhoto } from './api';

function App() {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);

  // Fetch all photos on page load
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
      // Step 1: Get upload URL from backend
      const { data } = await generateUploadURL(file.name);

      // Step 2: Upload file to the URL (S3 / local backend)
      await fetch(data.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      // Step 3: Save photo metadata to backend
      await savePhoto({ filename: file.name, url: data.url });
      alert("Uploaded successfully!");

      // Refresh photo list
      fetchPhotos();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Photo Uploader</h1>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: 10 }}>Upload</button>

      <h2>Photos</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 10
      }}>
        {photos.map(photo => (
          <div key={photo.id} style={{ border: '1px solid #ccc', padding: 5 }}>
            <img src={photo.url} alt={photo.filename} style={{ width: '100%' }} />
            <p>{photo.filename}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
