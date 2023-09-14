import React, { useState } from 'react';
import axios from 'axios';

function UploadImage() {
  const [image, setImage] = useState('');

  const onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
  };

  const onSubmit = event => {
    event.preventDefault();
    let file = event.target.elements.image.files[0];
    let reader = new FileReader();
    reader.onloadend = function () {
      const imageData = new Uint8Array(reader.result);
      axios.post('http://localhost:3001/api/images', {
        imageData: imageData,
        clientId: '************************' // replace with the actual client Id
      })
        .then(() => {
          console.log('Image uploaded successfully');
        })
        .catch((err) => {
          console.error('Failed to upload image:', err);
        });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="file" name="image" onChange={onImageChange} />
      <button type="submit">Upload</button>
      <img src={image ? URL.createObjectURL(image) : ''} alt="" />
    </form>
  );
}

export default UploadImage;
