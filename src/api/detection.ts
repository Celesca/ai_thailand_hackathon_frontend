import type { DetectionRequest, DetectionResponse } from '../types/detection';

// Configure your backend API endpoint here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.hackathon2025.ai.in.th/team06-1';

export const detectObjects = async (request: DetectionRequest): Promise<DetectionResponse> => {
  const response = await fetch(`${API_BASE_URL}/detect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const detectObjectsFromFile = async (
  file: File,
  textQueries: string[],
  boxThreshold: number,
  textThreshold: number,
  priority: number
): Promise<DetectionResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add each text query as a separate field
  textQueries.forEach(query => {
    formData.append('text_queries', query);
  });
  
  formData.append('box_threshold', boxThreshold.toString());
  formData.append('text_threshold', textThreshold.toString());
  formData.append('return_visualization', 'true');
  formData.append('async_processing', 'false');
  formData.append('priority', priority.toString());

  const response = await fetch(`${API_BASE_URL}/detect/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }

  return response.json();
};
