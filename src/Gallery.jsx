import React, { useEffect, useState } from "react";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5173/photos")
      .then(res => res.json())
      .then(data => setPhotos(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5173/photos/${id}`, { method: "DELETE" });
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "10px" }}>
      {photos.map(photo => (
        <div key={photo.id} style={{ position: "relative" }}>
          <img src={photo.url} alt="Photo" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
          <button
            onClick={() => handleDelete(photo.id)}
            style={{ position: "absolute", top: 5, right: 5, background: "red", color: "white", border: "none", borderRadius: 5, padding: "2px 5px", cursor: "pointer" }}
          >
          </button>
        </div>
      ))}
    </div>
  );
}