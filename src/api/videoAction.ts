import type { VideoActionResponse } from '../types/videoAction';
import { makeAPIRequest, getAPIErrorMessage } from './utils';

// Configure your backend API endpoint here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.hackathon2025.ai.in.th/team06-1';

export const detectVideoAction = async (
  file: File,
  prompt: string,
  personWeight: number = 0.3,
  actionWeight: number = 0.6,
  contextWeight: number = 0.1,
  similarityThreshold: number = 0.5,
  actionThreshold: number = 0.4,
  returnTimeline: boolean = true
): Promise<VideoActionResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);
    formData.append('person_weight', personWeight.toString());
    formData.append('action_weight', actionWeight.toString());
    formData.append('context_weight', contextWeight.toString());
    formData.append('similarity_threshold', similarityThreshold.toString());
    formData.append('action_threshold', actionThreshold.toString());
    formData.append('return_timeline', returnTimeline.toString());

    const response = await makeAPIRequest(`${API_BASE_URL}/video_action/detect/upload`, {
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
