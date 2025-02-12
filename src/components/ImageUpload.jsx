import { useState } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from 'react-oidc-context';

const ImageUpload = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const auth = useAuth();

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Only JPEG and PNG files are allowed';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const error = validateFile(selectedFile);
    
    if (error) {
      setError(error);
      setFile(null);
    } else {
      setError('');
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      await api.uploadImage(file, auth?.user?.profile, auth);
      setUploadComplete(true);
      setTimeout(() => {
        onClose();
      }, 1500); // Close modal after showing success state
    } catch (error) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Image</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={uploading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center relative
            ${uploadComplete ? 'border-green-500' : 'border-gray-300'}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files[0];
            const error = validateFile(droppedFile);
            if (error) {
              setError(error);
            } else {
              setFile(droppedFile);
              setError('');
            }
          }}
        >
          {uploading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="mt-2 text-blue-500">Uploading...</p>
              </div>
            </div>
          )}

          {uploadComplete && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="bg-green-100 rounded-full p-2">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <p className="mt-2 text-green-500">Upload Complete!</p>
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer flex flex-col items-center ${
              uploading ? 'pointer-events-none' : ''
            }`}
          >
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <span className="text-gray-600">
              Drop your image here or click to browse
            </span>
            <span className="text-sm text-gray-500 mt-2">
              Max file size: 5MB (JPEG or PNG only)
            </span>
          </label>

          {file && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Selected: {file.name}</p>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading || uploadComplete}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
              !file || uploading || uploadComplete
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
          >
            {uploading ? 'Uploading...' : uploadComplete ? 'Complete!' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;