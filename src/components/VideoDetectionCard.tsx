import React from 'react';
import type { VideoDetection } from '../types/videoAction';

interface VideoDetectionCardProps {
  detection: VideoDetection;
  index: number;
}

const VideoDetectionCard: React.FC<VideoDetectionCardProps> = ({ detection, index }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-blue-600 bg-blue-100';
    if (confidence >= 0.4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const formatTimestamp = (timestamp: number) => {
    const minutes = Math.floor(timestamp / 60);
    const seconds = (timestamp % 60).toFixed(2);
    return `${minutes}:${seconds.padStart(5, '0')}`;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 animate-fade-in">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-purple-100 rounded-md flex items-center justify-center mr-2 flex-shrink-0">
            <span className="text-purple-600 text-xs font-semibold">#{index + 1}</span>
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm">Frame {detection.frame_idx}</h4>
            <p className="text-gray-500 text-xs">@ {formatTimestamp(detection.timestamp)}</p>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getConfidenceColor(detection.confidence)}`}>
          {Math.round(detection.confidence * 100)}%
        </div>
      </div>

      {/* Description */}
      <div className="mb-2">
        <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">"{detection.blip_description}"</p>
      </div>

      {/* Similarity Scores */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-600">Person:</span>
          <div className="font-mono text-xs bg-green-50 p-1 rounded mt-1">
            {(detection.similarity_scores.person * 100).toFixed(1)}%
          </div>
        </div>
        <div>
          <span className="text-gray-600">Action:</span>
          <div className="font-mono text-xs bg-blue-50 p-1 rounded mt-1">
            {(detection.similarity_scores.action * 100).toFixed(1)}%
          </div>
        </div>
        <div>
          <span className="text-gray-600">Context:</span>
          <div className="font-mono text-xs bg-orange-50 p-1 rounded mt-1">
            {(detection.similarity_scores.context * 100).toFixed(1)}%
          </div>
        </div>
        <div>
          <span className="text-gray-600">Weighted:</span>
          <div className="font-mono text-xs bg-purple-50 p-1 rounded mt-1">
            {(detection.similarity_scores.weighted * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {detection.passed && (
        <div className="mt-2 flex items-center">
          <span className="text-green-600 text-xs">✓ Passed Detection</span>
        </div>
      )}
    </div>
  );
};

export default VideoDetectionCard;
