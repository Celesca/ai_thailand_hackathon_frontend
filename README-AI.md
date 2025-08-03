# AI Object Detection Platform

A modern React frontend for zero-shot object detection using natural language queries. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Zero-Shot Object Detection**: Detect objects in images using natural language descriptions
- **Flexible Image Input**: Support for both file uploads and URL inputs
- **Interactive Query System**: Add/remove detection queries dynamically
- **Adjustable Thresholds**: Fine-tune detection sensitivity
- **Real-time Visualization**: View detected objects with bounding boxes
- **Detailed Results**: Get confidence scores and precise coordinates
- **Modern UI**: Clean, responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- Your backend API running (configured in `.env`)

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Configure your backend API endpoint:
```bash
cp .env.example .env
# Edit .env file to set your backend URL
```

3. Start the development server:
```bash
npm run dev
```

## Configuration

### Backend API

Update the `VITE_API_BASE_URL` in your `.env` file to point to your backend API:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### API Endpoint

The frontend expects your backend to have an endpoint at `/api/detect` that accepts POST requests with the following structure:

**Request Body:**
```json
{
  "image_url": "string",
  "text_queries": ["string array"],
  "box_threshold": 0.4,
  "text_threshold": 0.4,
  "return_visualization": true,
  "async_processing": false,
  "priority": 5
}
```

**Response Body:**
```json
{
  "success": true,
  "num_detections": 1,
  "detections": [
    {
      "id": 1,
      "label": "a cat",
      "confidence": 0.439,
      "bounding_box": {
        "x_min": 439.1,
        "y_min": 252.46,
        "x_max": 2063.17,
        "y_max": 1392.97,
        "width": 1624.06,
        "height": 1140.51
      }
    }
  ],
  "image_size": {
    "width": 2500,
    "height": 1667
  },
  "queries": ["a cat", "a remote control", "a person"],
  "thresholds": {
    "box_threshold": 0.4,
    "text_threshold": 0.4
  },
  "visualization": {
    "image_base64": "base64_encoded_image_with_bounding_boxes"
  }
}
```

## Usage

1. **Select Function**: Use the sidebar to navigate between different AI functions
2. **Upload Image**: Either upload a file or provide an image URL
3. **Add Queries**: Specify what objects you want to detect using natural language
4. **Adjust Settings**: Fine-tune detection thresholds and priority
5. **Generate**: Click "Generate Detection" to process the image
6. **View Results**: See the detected objects with bounding boxes and details

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── ObjectDetection.tsx  # Main detection interface
│   └── ComingSoon.tsx       # Placeholder for future features
├── types/
│   └── detection.ts         # TypeScript interfaces
├── api/
│   └── detection.ts         # API utility functions
├── App.tsx                  # Main application component
└── App.css                  # Global styles
```

## Building for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool and dev server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
