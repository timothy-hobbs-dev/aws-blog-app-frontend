import { useState, useEffect } from 'react';
import { api } from '../services/api';
import ImageCard from './ImageCard';
import { Loader } from 'lucide-react';
import { useAuth } from 'react-oidc-context';

const AllPics = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const auth = useAuth();

  const fetchImages = async (auth) => {
    try {
      const response = await api.getImages(auth,{
        page,
        per_page: 20,
        sort_by: 'uploadDate',
        sort_order: 'desc',
      });
      
      if (response.data.images.length < 20) {
        setHasMore(false);
      }
      
      setImages(prev => page === 1 ? response.data.images : [...prev, ...response.data.images]);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(auth);
  }, [page,auth]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Pictures</h1>
      
      {loading && page === 1 ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <ImageCard
                key={image.imageId}
                image={image}
                onShare={api.shareImage}
                showDeleteOption={false}
              />
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllPics;