import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { ImagePlus, Share2, Trash2, RefreshCw } from "lucide-react";

const Landing = () => {
  const auth = useAuth();
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Generate 3 random image URLs from Picsum
    const randomIds = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 1000)
    );
    const newImages = randomIds.map(
      (id) => `https://picsum.photos/400/400?random=${id}`
    );
    setImages(newImages);
  }, []);

  const features = [
    {
      icon: <ImagePlus className="w-8 h-8 text-blue-500" />,
      title: "Easy Upload",
      description:
        "Upload your images with a simple drag and drop interface. Support for JPEG and PNG formats.",
    },
    {
      icon: <Share2 className="w-8 h-8 text-green-500" />,
      title: "Instant Sharing",
      description:
        "Generate shareable links instantly and share your images with anyone, anywhere.",
    },
    {
      icon: <Trash2 className="w-8 h-8 text-red-500" />,
      title: "Safe Delete",
      description:
        "Never lose an image by accident with our recycle bin feature. Restore deleted images anytime.",
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-purple-500" />,
      title: "Auto Processing",
      description:
        "Your images are automatically processed for optimal quality and fast loading.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Personal Image Gallery
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Store, manage, and share your images with ease. Professional tools
            with a simple interface.
          </p>
          <button
            onClick={() => auth.signinRedirect()}
            className="px-8 py-4 bg-blue-500 text-white rounded-full text-lg font-semibold 
                     hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 
                     shadow-lg hover:shadow-xl"
          >
            Login
          </button>
          <Link
            to="/signup"
            className={`px-3 py-2 rounded-md`}
          >
             Sign Up
          </Link>

        </div>

        {/* Abstract Shapes */}
        <div className="relative mt-16">
          <div
            className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full 
                        mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          ></div>
          <div
            className="absolute top-0 right-1/4 w-72 h-72 bg-purple-200 rounded-full 
                        mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          ></div>
          <div
            className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-200 rounded-full 
                        mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
          ></div>

          {/* Demo Images Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {images.map((src, index) => (
              <div
                key={index}
                className="bg-white p-2 rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                  <img
                    src={src}
                    alt={`Random ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-gray-50 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 border-t">
        <p>© {new Date().getFullYear()} Image Gallery. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
