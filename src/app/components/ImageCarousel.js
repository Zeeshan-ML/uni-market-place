// File: src/app/components/ImageCarousel.js
import { useState } from 'react';
import Image from 'next/image';

function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {images.length > 0 ? (
        <>
          <Image
            src={images[currentIndex]}
            alt="Product Image"
            width={600}
            height={400}
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
          >
            &lt;
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
          >
            &gt;
          </button>
        </>
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">No Images Available</div>
      )}
    </div>
  );
}

export default ImageCarousel;