import React, { useState } from 'react';
import { Share2, Trash, ZoomIn, X } from 'lucide-react';

// Helper function for time since
const timeSince = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
};

const ImageCard = ({ image, onDelete, onShare, showDeleteOption = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShare = async () => {
    const response = await onShare(image.imageId);
    if (response?.data?.url) {
      await navigator.clipboard.writeText(response.data.url);
      alert('Link copied to clipboard!');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Image Container */}
        <div 
          className="relative aspect-square cursor-pointer overflow-hidden"
          onClick={openModal}
        >
          <img
            src={image.processedUrl}
            alt={image.originalFilename}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <ZoomIn className="w-12 h-12 text-white p-3 bg-black/30 rounded-full backdrop-blur-sm" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate text-gray-800">
                {image.originalFilename}
              </h3>
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {timeSince(image.uploadDate)}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">
                  by: {image.userId}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            {showDeleteOption && (
              <button
                onClick={() => onDelete(image.imageId)}
                className="flex items-center px-3 py-1.5 text-sm rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
              >
                <Trash className="w-4 h-4 mr-1.5" />
                Delete
              </button>
            )}
            <button
              onClick={handleShare}
              className="flex items-center px-3 py-1.5 text-sm rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
            >
              <Share2 className="w-4 h-4 mr-1.5" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Modal - Now with proper z-index and positioning */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-[90vw] max-h-[90vh] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 z-[101] text-white hover:text-gray-200 bg-black/50 hover:bg-black/70 rounded-full p-2 backdrop-blur-sm transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={image.processedUrl}
              alt={image.originalFilename}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCard;