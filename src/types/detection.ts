export interface BoundingBox {
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
  width: number;
  height: number;
}

export interface Detection {
  id: number;
  label: string;
  confidence: number;
  bounding_box: BoundingBox;
}

export interface ImageSize {
  width: number;
  height: number;
}

export interface Thresholds {
  box_threshold: number;
  text_threshold: number;
}

export interface Visualization {
  image_base64: string;
}

export interface DetectionRequest {
  image_url: string;
  text_queries: string[];
  box_threshold: number;
  text_threshold: number;
  return_visualization: boolean;
  async_processing: boolean;
  priority: number;
}

export interface DetectionResponse {
  success: boolean;
  num_detections: number;
  detections: Detection[];
  image_size: ImageSize;
  queries: string[];
  thresholds: Thresholds;
  visualization: Visualization;
}
