import { Link, useLocation } from 'react-router-dom';
import { ImagePlus, LogOut } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const signOutRedirect = () => {
    const clientId = "4itcs5ls66eleck71rv0afqrkq";
    const origin = window.location.origin;
    const logoutUri = `${origin}/start`;
    const cognitoDomain = "https://photos-primary.auth.eu-central-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              ImageGallery
            </Link>
            <div className="flex space-x-4 items-center">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md ${
                  location.pathname === '/' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Pictures
              </Link>
              <Link
                to="/my-pics"
                className={`px-3 py-2 rounded-md ${
                  location.pathname === '/my-pics'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                My Pictures
              </Link>
              <Link
                to="/recycle-bin"
                className={`px-3 py-2 rounded-md ${
                  location.pathname === '/recycle-bin'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Recycle Bin
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <ImagePlus className="w-5 h-5 mr-2" />
              Upload Image
            </button>

            {/* Logout Icon */}
            <LogOut
              onClick={signOutRedirect}
              className="h-6 w-6 text-gray-600 hover:text-red-500 cursor-pointer transition-colors"
            />
          </div>
        </div>
      </div>

      {isUploadModalOpen && (
        <ImageUpload onClose={() => setIsUploadModalOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
