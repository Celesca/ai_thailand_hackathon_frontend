import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ObjectDetection from './components/ObjectDetection'
import VideoActionDetection from './components/VideoActionDetection'
import './App.css'

function App() {
  const [activeFunction, setActiveFunction] = useState('object-detection')

  const renderActiveComponent = () => {
    switch (activeFunction) {
      case 'object-detection':
        return <ObjectDetection />
      case 'video-action':
        return <VideoActionDetection />
      default:
        return <ObjectDetection />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar 
          activeFunction={activeFunction} 
          onFunctionChange={setActiveFunction} 
        />
        <main className="flex-1 ml-64">
          <div className="p-4">
            {renderActiveComponent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
