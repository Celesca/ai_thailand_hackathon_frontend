import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ObjectDetection from './components/ObjectDetection'
import VideoActionDetection from './components/VideoActionDetection'
import './App.css'

function App() {
  const [activeFunction, setActiveFunction] = useState('object-detection')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 lg:ml-64 min-h-screen">
          {/* Mobile header */}
          <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600 text-lg">🎯</span>
                </div>
                <div>
                  <h1 className="text-lg font-sm text-black">DAMZ</h1>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8">
            {renderActiveComponent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
