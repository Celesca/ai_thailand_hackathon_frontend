import React, { useState } from 'react';
import type { DetectionRequest, DetectionResponse } from '../types/detection';
import { detectObjects, detectObjectsFromFile } from '../api/detection';
import DetectionCard from './DetectionCard';
import ErrorNotification from './ErrorNotification';
// Temporarily disabled: import DemoData from './DemoData';

interface ObjectDetectionProps {}

const ObjectDetection: React.FC<ObjectDetectionProps> = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textQueries, setTextQueries] = useState(['a cat', 'a remote control', 'a person']);
  const [boxThreshold, setBoxThreshold] = useState(0.4);
  const [textThreshold, setTextThreshold] = useState(0.4);
  const [priority, setPriority] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setImageUrl(''); // Clear URL when file is uploaded
      
      // Create preview URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setUploadedFile(null); // Clear uploaded file when URL is entered
  };

  const addTextQuery = () => {
    setTextQueries([...textQueries, '']);
  };

  const updateTextQuery = (index: number, value: string) => {
    const updated = [...textQueries];
    updated[index] = value;
    setTextQueries(updated);
  };

  const removeTextQuery = (index: number) => {
    if (textQueries.length > 1) {
      setTextQueries(textQueries.filter((_, i) => i !== index));
    }
  };

  const loadDemoImage = (url: string, queries: string[]) => {
    setImageUrl(url);
    setUploadedFile(null); // Clear uploaded file when demo image is loaded
    setTextQueries(queries);
    setResult(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!imageUrl && !uploadedFile) {
      setError('Please provide an image URL or upload an image');
      return;
    }

    if (textQueries.filter(q => q.trim()).length === 0) {
      setError('Please provide at least one text query');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let data: DetectionResponse;
      
      if (uploadedFile) {
        // Use file upload API for uploaded files
        data = await detectObjectsFromFile(
          uploadedFile,
          textQueries.filter(q => q.trim()),
          boxThreshold,
          textThreshold,
          priority
        );
      } else {
        // Use URL-based API for image URLs
        const requestBody: DetectionRequest = {
          image_url: imageUrl,
          text_queries: textQueries.filter(q => q.trim()),
          box_threshold: boxThreshold,
          text_threshold: textThreshold,
          return_visualization: true,
          async_processing: false,
          priority: priority
        };
        data = await detectObjects(requestBody);
      }
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during detection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl animate-fade-in">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="bg-white rounded-lg p-4 sm:p-6 card-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <span className="text-purple-600 text-lg sm:text-xl">🎯</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Zero-Shot Object Detection</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Upload an image and describe what objects you want to detect
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Input Panel */}
        <div className="space-y-4 sm:space-y-6">
          {/* Image Input */}
          <div className="bg-white rounded-lg p-4 sm:p-6 card-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Input</h3>
            
            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-purple-400 transition-colors">
                  <div className="text-gray-400 text-xl sm:text-2xl mb-2">📁</div>
                  <p className="text-gray-600 font-medium text-sm sm:text-base">Click to upload an image</p>
                  <p className="text-gray-500 text-xs sm:text-sm">or drag and drop your file here</p>
                </div>
              </div>
            </div>

            {/* Or separator */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Text Queries */}
          <div className="bg-white rounded-lg p-4 sm:p-6 card-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Queries</h3>
            
            <div className="space-y-3">
              {textQueries.map((query, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => updateTextQuery(index, e.target.value)}
                    placeholder="e.g., a cat, a person, a car"
                    className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {textQueries.length > 1 && (
                    <button
                      onClick={() => removeTextQuery(index)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              onClick={addTextQuery}
              className="mt-3 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg text-sm font-medium transition-colors touch-manipulation"
            >
              + Add Query
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg p-4 sm:p-6 card-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Box Threshold</label>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{boxThreshold}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={boxThreshold}
                  onChange={(e) => setBoxThreshold(parseFloat(e.target.value))}
                  className="w-full slider touch-manipulation"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Text Threshold</label>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{textThreshold}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={textThreshold}
                  onChange={(e) => setTextThreshold(parseFloat(e.target.value))}
                  className="w-full slider touch-manipulation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={priority}
                  onChange={(e) => setPriority(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 touch-manipulation ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-black border-2 border-purple-600 card-shadow'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </div>
            ) : (
              'Generate Detection'
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="space-y-4 sm:space-y-6">
          {/* Preview Image */}
          {imageUrl && (
            <div className="bg-white rounded-lg p-4 sm:p-6 card-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Image</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Input"
                  className="w-full h-auto max-h-96 object-contain"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-red-500 mr-3">⚠️</div>
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Visualization */}
              {result.visualization && (
                <div className="bg-white rounded-lg p-6 card-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Results</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={`data:image/jpeg;base64,${result.visualization.image_base64}`}
                      alt="Detection visualization"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}

              {/* Detection Details */}
              <div className="bg-white rounded-lg p-6 card-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Objects Found ({result.num_detections})
                </h3>
                
                {result.detections.length > 0 ? (
                  <div className="space-y-4">
                    {result.detections.map((detection, index) => (
                      <DetectionCard 
                        key={detection.id} 
                        detection={detection} 
                        index={index} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-gray-500">No objects detected with current settings</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting the thresholds or queries</p>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Detection Info</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Image Size:</span>
                    <span className="ml-2 font-mono">{result.image_size.width} × {result.image_size.height}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Box Threshold:</span>
                    <span className="ml-2 font-mono">{result.thresholds.box_threshold}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Text Threshold:</span>
                    <span className="ml-2 font-mono">{result.thresholds.text_threshold}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Queries:</span>
                    <span className="ml-2">{result.queries.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demo Data - Inline version */}
          <div className="bg-white rounded-lg p-6 card-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 text-lg">💡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Demo Images</h3>
                <p className="text-gray-600 text-sm">Try these sample images to get started</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                   onClick={() => loadDemoImage('https://images.unsplash.com/photo-1606567595334-d39972c85dbe', ['a cat', 'a dog'])}>
                <div className="flex gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1606567595334-d39972c85dbe"
                    alt="Pets & Animals"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Pets & Animals</h4>
                    <p className="text-gray-600 text-xs mb-2">Perfect for detecting cats, dogs, and other pets</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">a cat</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">a dog</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                   onClick={() => loadDemoImage('https://images.unsplash.com/photo-1449824913935-59a10b8d2000', ['traffic light', 'a man with red shirt', 'yellow car'])}>
                <div className="flex gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000"
                    alt="City Traffic Scene"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">City Traffic Scene</h4>
                    <p className="text-gray-600 text-xs mb-2">Urban scene with vehicles, people, and traffic infrastructure</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">traffic light</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">a man with red shirt</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">yellow car</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                   onClick={() => loadDemoImage('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Mangoes_%28Magnifera_indica%29_from_India.jpg/1200px-Mangoes_%28Magnifera_indica%29_from_India.jpg', ['green mango', 'rotten mango', 'devil fruit'])}>
                <div className="flex gap-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Mangoes_%28Magnifera_indica%29_from_India.jpg/1200px-Mangoes_%28Magnifera_indica%29_from_India.jpg"
                    alt="Mangoes"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Mangoes</h4>
                    <p className="text-gray-600 text-xs mb-2">Perfect for detecting different types of mangoes</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">green mango</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">rotten mango</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">devil fruit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-purple-700 text-xs">
                <strong>Tip:</strong> Click on any demo image above to automatically load it for detection.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error Notification */}
      <ErrorNotification 
        error={error} 
        onClose={() => setError(null)} 
      />
    </div>
  );
};

export default ObjectDetection;
