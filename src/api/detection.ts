import type { DetectionRequest, DetectionResponse } from '../types/detection';
import { makeAPIRequest, getAPIErrorMessage } from './utils';

// Configure your backend API endpoint here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.hackathon2025.ai.in.th/team06-1';

export const detectObjects = async (request: DetectionRequest): Promise<DetectionResponse> => {
  try {
    const response = await makeAPIRequest(`${API_BASE_URL}/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return await response.json();
  } catch (error) {
    throw new Error(getAPIErrorMessage(error));
  }
};

export const detectObjectsFromFile = async (
  file: File,
  textQueries: string[],
  boxThreshold: number,
  textThreshold: number,
  priority: number
): Promise<DetectionResponse> => {
  try {
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

    const response = await makeAPIRequest(`${API_BASE_URL}/detect/upload`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
        'Accept': 'application/json',
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    throw new Error(getAPIErrorMessage(error));
  }
};
