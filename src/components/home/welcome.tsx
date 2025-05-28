"use client";
import React from "react";

// Define the prop type
interface WelcomeProps {
  onContinueWithoutAccount: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onContinueWithoutAccount }) => {
  const images = [
    {
      src: "https://i.pinimg.com/736x/18/c1/27/18c1270c05243d892bfe6641147454cb.jpg ",
      text: "Find Your Favorite Products",
    },
    {
      src: "https://i.pinimg.com/736x/f8/1b/87/f81b87e21f8ad3acd29a16f4033169f8.jpg",
      text: "Experience eco-luxury living",
    },
    {
      src: "https://i.pinimg.com/736x/95/ba/3a/95ba3a159462815c4b14a5e9a9c1d28a.jpg",
      text: "Sustainability meets comfort",
    },
    {
      src: "https://i.pinimg.com/736x/3e/87/71/3e87713319867f2808bdb8dfabbdca3b.jpg",
      text: "Sustainability meets comfort",
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-green-400 to-blue-500">
      {/* Image Section */}
      <div className="relative flex-1">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              className="w-full h-full object-cover rounded-lg shadow-lg"
              src={image.src}
              alt={image.text}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <p className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center px-4">
                {image.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Button Section */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-8 md:p-16">
        <button
          className="w-3/4 sm:w-2/3 lg:w-1/2 p-4 mb-6 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300 focus:ring-4 focus:ring-green-300 focus:outline-none"
          onClick={onContinueWithoutAccount}
        >
          Continue Without Account
        </button>
        <button className="w-3/4 sm:w-2/3 lg:w-1/2 p-4 text-lg font-semibold text-green-600 bg-white border border-green-600 rounded-lg shadow-md hover:bg-green-50 focus:ring-4 focus:ring-green-300 focus:outline-none transition-all duration-300 hover:scale-105">
          Join EcoLuxe
        </button>
      </div>
    </div>
  );
};

export default Welcome;
