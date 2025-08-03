import React from 'react';
import type { Detection } from '../types/detection';

interface DetectionCardProps {
  detection: Detection;
  index: number;
}

const DetectionCard: React.FC<DetectionCardProps> = ({ detection, index }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-blue-600 bg-blue-100';
    if (confidence >= 0.4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-purple-600 text-sm font-semibold">#{index + 1}</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{detection.label}</h4>
            <p className="text-gray-600 text-sm">ID: {detection.id}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(detection.confidence)}`}>
          {Math.round(detection.confidence * 100)}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Box:</span>
          <div className="font-mono text-xs mt-1 bg-gray-50 p-2 rounded">
            x: {detection.bounding_box.x_min.toFixed(1)} - {detection.bounding_box.x_max.toFixed(1)}<br/>
            y: {detection.bounding_box.y_min.toFixed(1)} - {detection.bounding_box.y_max.toFixed(1)}
          </div>
        </div>
        <div>
          <span className="text-gray-600">Size:</span>
          <div className="font-mono text-xs mt-1 bg-gray-50 p-2 rounded">
            w: {detection.bounding_box.width.toFixed(1)}<br/>
            h: {detection.bounding_box.height.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionCard;
