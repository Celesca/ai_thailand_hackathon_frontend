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
