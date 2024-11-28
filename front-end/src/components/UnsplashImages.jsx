import React, { useEffect, useState } from 'react';
import { getPhotosByQuery } from '../../api/unsplash-api.js'; // Adjust the import path as necessary

const ImageGallery = ({ query , numberOfImages, randomPage}) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {

      const data = await getPhotosByQuery(query, numberOfImages, randomPage);
      setPhotos(data.results);
    };
    fetchPhotos();
  }, [query,randomPage, numberOfImages]);

  return (
    <div>
      {photos.map(photo => (
        <img key={photo.id} src={photo.urls.small} alt={photo.description} />
      ))}
    </div>
  );
};

export default ImageGallery;