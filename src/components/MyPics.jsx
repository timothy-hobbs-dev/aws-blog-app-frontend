// src/components/MyPics.jsx
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import ImageCard from './ImageCard';
import ImageUpload from './ImageUpload';
import { Loader, ImagePlus } from 'lucide-react';
import { useAuth } from 'react-oidc-context';
const MyPics = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const auth = useAuth();

  const fetchImages = async () => {
    try {
      const response = await api.getImages(auth,{
        my_pics: true,
        sort_by: 'uploadDate',
        sort_order: 'desc',
      });
      setImages(response.data.images);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [auth]);

  const handleDelete = async (imageId) => {
    if (window.confirm('Are you sure you want to move this image to the recycle bin?')) {
      try {
        await api.deleteImage(imageId,auth);
        setImages(images => images.filter(img => img.imageId !== imageId));
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
  };

  const handleShare = async (imageId) => {
    try {
      const response = await api.shareImage(imageId);
      return response;
    } catch (error) {
      console.error('Failed to generate share link:', error);
      alert('Failed to generate share link. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Pictures</h1>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <ImagePlus className="w-5 h-5 mr-2" />
          Upload New Image
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16">
          <ImagePlus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">You haven't uploaded any images yet</p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Upload Your First Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <ImageCard
              key={image.imageId}
              image={image}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          ))}
        </div>
      )}

      {isUploadModalOpen && (
        <ImageUpload 
          onClose={() => {
            setIsUploadModalOpen(false);
            fetchImages(); // Refresh the images after upload
          }}
        />
      )}
    </div>
  );
};

export default MyPics;