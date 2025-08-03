export interface SimilarityScores {
  person: number;
  action: number;
  context: number;
  weighted: number;
}

export interface VideoDetection {
  timestamp: number;
  frame_idx: number;
  confidence: number;
  blip_description: string;
  similarity_scores: SimilarityScores;
  passed: boolean;
}

export interface VideoSegment {
  start_time: number;
  end_time: number;
  confidence: number;
  frame_count: number;
  action_label: string;
  detections: VideoDetection[];
}

export interface VideoStats {
  total_frames: number;
  total_detections: number;
  passed_detections: number;
  success_rate: number;
  segments_found: number;
}

export interface VideoActionRequest {
  file: File;
  prompt: string;
  person_weight: number;
  action_weight: number;
  context_weight: number;
  similarity_threshold: number;
  action_threshold: number;
  return_timeline: boolean;
}

export interface VideoActionResponse {
  success: boolean;
  job_id: string;
  video_path: string;
  prompt: string;
  action_verb: string;
  timestamp: string;
  video_duration: number;
  stats: VideoStats;
  passed_detections: VideoDetection[];
  segments: VideoSegment[];
  timeline_visualization: string | null;
  error: string | null;
}
