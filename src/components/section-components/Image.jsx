import React from "react";

export default function Image() {
  const [image, setImage] = React.useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <div className="image-div">
      <input type="file" className="image" onChange={onImageChange} />
      <img alt="Preview Image" src={image} />
    </div>
  );
}
