import { useState } from "react";

// Product Image Slider Component
const ProductImageSlider = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleThumbnailClick = (index) => {
    setCurrentImage(index);
  };


  return (
    <div className="flex flex-col items-center">
      {/* Main Image Display */}
      <div className="relative w-full h-80 bg-gray-200 flex items-center justify-center py-4">
        {images.length > 0? (
          <img
            src={images[currentImage].avatar_url}
            alt={`Image ${currentImage + 1}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-gray-500">No Image Available</span>
        )}

        <button
          onClick={() =>
            setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))
          }
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          &lt;
        </button>
        <button
          onClick={() =>
            setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))
          }
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          &gt;
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex mt-4 space-x-2">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`w-16 h-16 object-cover cursor-pointer flex items-center justify-center ${
              currentImage === index ? "border-2 border-red-500" : ""
            }`}
          >
            <img
              src={image.avatar_url}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageSlider;
