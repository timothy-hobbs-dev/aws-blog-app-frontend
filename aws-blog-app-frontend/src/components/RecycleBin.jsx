// src/components/RecycleBin.jsx
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Loader, RefreshCw, TrashIcon } from 'lucide-react';
import { useAuth } from "react-oidc-context";

const RecycleBin = () => {
  const [deletedImages, setDeletedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  const fetchDeletedImages = async () => {
    try {
      const response = await api.getImages(auth,{
        is_deleted: true,
        sort_by: 'uploadDate',
        sort_order: 'desc',
      });
      setDeletedImages(response.data.images);
    } catch (error) {
      console.error('Failed to fetch deleted images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedImages();
  }, []);

  const handlePermanentDelete = async (imageId) => {
    if (window.confirm('Are you sure you want to permanently delete this image? This action cannot be undone.')) {
      try {
        await api.deleteImage(imageId,auth,true,false);
        setDeletedImages(images => images.filter(img => img.imageId !== imageId));
      } catch (error) {
        console.error('Failed to permanently delete image:', error);
      }
    }
  };

  const handleRestore = async (imageId) => {
    try {
      await api.deleteImage(imageId, auth, false, true);
      setDeletedImages(images => images.filter(img => img.imageId !== imageId));
    } catch (error) {
      console.error('Failed to restore image:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Recycle Bin</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      ) : deletedImages.length === 0 ? (
        <div className="text-center py-16">
          <TrashIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Recycle bin is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deletedImages.map((image) => (
            <div key={image.imageId} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={image.processedUrl}
                  alt={image.originalFilename}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{image.originalFilename}</h3>
                <p className="text-sm text-gray-500">
                  Deleted on: {new Date(image.deletedAt || image.uploadDate).toLocaleDateString()}
                </p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handlePermanentDelete(image.imageId)}
                    className="flex items-center text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete Permanently
                  </button>
                  <button
                    onClick={() => handleRestore(image.imageId)}
                    className="flex items-center text-green-500 hover:text-green-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Restore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecycleBin;