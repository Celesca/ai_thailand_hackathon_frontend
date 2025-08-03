import React, { useState } from 'react';
import type { VideoActionResponse } from '../types/videoAction';
import { detectVideoAction } from '../api/videoAction';
import VideoDetectionCard from './VideoDetectionCard';
import ErrorNotification from './ErrorNotification';

interface VideoActionDetectionProps {}

const VideoActionDetection: React.FC<VideoActionDetectionProps> = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [prompt, setPrompt] = useState('person running walking');
  const [personWeight, setPersonWeight] = useState(0.3);
  const [actionWeight, setActionWeight] = useState(0.6);
  const [contextWeight, setContextWeight] = useState(0.1);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.5);
  const [actionThreshold, setActionThreshold] = useState(0.4);
  const [returnTimeline, setReturnTimeline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VideoActionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      
      // Create preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      setError('Please upload a video file');
      return;
    }

    if (!prompt.trim()) {
      setError('Please provide a prompt describing the action to detect');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await detectVideoAction(
        videoFile,
        prompt.trim(),
        personWeight,
        actionWeight,
        contextWeight,
        similarityThreshold,
        actionThreshold,
        returnTimeline
      );
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during video analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl animate-fade-in">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-white rounded-lg p-4 sm:p-6 card-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <span className="text-purple-600 text-lg sm:text-xl">🎬</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Video Action Detection</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Upload a video and detect specific actions using natural language
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Video Upload */}
          <div className="bg-white rounded-lg p-4 sm:p-6 card-shadow">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Video Upload</h3>
            
            <div className="mb-3">
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-purple-400 transition-colors">
                  <div className="text-gray-400 text-lg mb-1">🎥</div>
                  <p className="text-gray-600 text-sm font-medium">Upload Video</p>
                  <p className="text-gray-500 text-xs">MP4, MOV, AVI supported</p>
                </div>
              </div>
            </div>

            {videoFile && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <strong>Selected:</strong> {videoFile.name}
                <br />
                <strong>Size:</strong> {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            )}
          </div>

          {/* Action Prompt */}
          <div className="bg-white rounded-lg p-4 card-shadow">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Action Prompt</h3>
            
            <div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., person running walking, dog jumping, car turning"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Settings - Compact */}
          <div className="bg-white rounded-lg p-4 card-shadow">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Detection Settings</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-700">Person Weight</label>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{personWeight}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={personWeight}
                  onChange={(e) => setPersonWeight(parseFloat(e.target.value))}
                  className="w-full slider"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-700">Action Weight</label>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{actionWeight}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={actionWeight}
                  onChange={(e) => setActionWeight(parseFloat(e.target.value))}
                  className="w-full slider"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-700">Context Weight</label>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{contextWeight}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={contextWeight}
                  onChange={(e) => setContextWeight(parseFloat(e.target.value))}
                  className="w-full slider"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-700">Similarity Threshold</label>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{similarityThreshold}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={similarityThreshold}
                  onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                  className="w-full slider"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-700">Action Threshold</label>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{actionThreshold}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={actionThreshold}
                  onChange={(e) => setActionThreshold(parseFloat(e.target.value))}
                  className="w-full slider"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="returnTimeline"
                  checked={returnTimeline}
                  onChange={(e) => setReturnTimeline(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="returnTimeline" className="text-xs font-medium text-gray-700">
                  Return Timeline Visualization
                </label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-black border-2 border-purple-600 card-shadow'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Analyzing Video...
              </div>
            ) : (
              'Detect Actions'
            )}
          </button>
        </div>

        {/* Results Panel - Takes 2/3 of space */}
        <div className="xl:col-span-2 space-y-4">
          {/* Video Preview */}
          {videoPreview && (
            <div className="bg-white rounded-lg p-4 card-shadow">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Video Preview</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-auto"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="text-red-500 mr-2">⚠️</div>
                <div>
                  <h3 className="font-semibold text-red-800 text-sm">Error</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Statistics */}
              <div className="bg-white rounded-lg p-4 card-shadow">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Analysis Results</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{result.stats.total_detections}</div>
                    <div className="text-xs text-blue-800">Total Detections</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{result.stats.passed_detections}</div>
                    <div className="text-xs text-green-800">Passed Detections</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{result.stats.success_rate.toFixed(1)}%</div>
                    <div className="text-xs text-purple-800">Success Rate</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{result.stats.segments_found}</div>
                    <div className="text-xs text-orange-800">Segments Found</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>Job ID:</strong> {result.job_id}</p>
                  <p><strong>Action Verb:</strong> {result.action_verb}</p>
                  <p><strong>Video Duration:</strong> {result.video_duration.toFixed(2)}s</p>
                </div>
              </div>

              {/* Timeline Visualization */}
              {result.timeline_visualization && (
                <div className="bg-white rounded-lg p-4 card-shadow">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Timeline Visualization</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={`data:image/png;base64,${result.timeline_visualization}`}
                      alt="Timeline visualization"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}

              {/* Segments */}
              {result.segments.length > 0 && (
                <div className="bg-white rounded-lg p-4 card-shadow">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    Action Segments ({result.segments.length})
                  </h3>
                  
                  <div className="space-y-3">
                    {result.segments.map((segment, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            Segment {index + 1}: {segment.action_label}
                          </h4>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {Math.round(segment.confidence * 100)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          <span className="mr-4">
                            <strong>Time:</strong> {segment.start_time.toFixed(2)}s - {segment.end_time.toFixed(2)}s
                          </span>
                          <span>
                            <strong>Frames:</strong> {segment.frame_count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detection Details */}
              {result.passed_detections.length > 0 && (
                <div className="bg-white rounded-lg p-4 card-shadow">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    Detection Details ({result.passed_detections.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.passed_detections.map((detection, index) => (
                      <VideoDetectionCard 
                        key={index}
                        detection={detection} 
                        index={index} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Start Tips - Only show when no video is loaded */}
          {!videoFile && !result && (
            <div className="bg-white rounded-lg p-4 card-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-purple-600 text-sm">💡</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900">Quick Start</h3>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Upload a video file (MP4, MOV, AVI)</p>
                <p>• Describe the action you want to detect</p>
                <p>• Adjust detection weights if needed</p>
                <p>• Click "Detect Actions" to analyze the video</p>
              </div>
              
              <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-700 text-xs">
                  <strong>Tip:</strong> Be specific with your action prompts for better results. 
                  Example: "person running walking" detects running and walking actions.
                </p>
              </div>
            </div>
          )}
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

export default VideoActionDetection;
