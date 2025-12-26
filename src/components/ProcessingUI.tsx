import { useState, useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'

const messages = [
  'Scraping website...',
  'Generating questions...',
  'Analyzing content...',
  'Creating quiz...',
]

export default function ProcessingUI() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    // Rotate messages every 2 seconds
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        {/* Loader Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        </div>

        {/* Rotating Message */}
        <div className="mb-4 min-h-[2rem] flex items-center justify-center">
          <p
            key={currentMessageIndex}
            className="text-xl font-semibold text-gray-900 animate-fade-in"
          >
            {messages[currentMessageIndex]}
          </p>
        </div>

        {/* Hint Text */}
        <p className="text-sm text-gray-500">
          This usually takes 10–30 seconds
        </p>
      </div>
    </div>
  )
}

