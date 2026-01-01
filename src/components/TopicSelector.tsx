import { useState, useEffect } from 'react'
import type { Topic } from '../types/quiz'
import LoadingSpinner from './LoadingSpinner'

interface TopicSelectorProps {
  topics: Topic[]
  onGenerate: (topicIds: string[]) => void
  isLoading?: boolean
}

export default function TopicSelector({ topics, onGenerate, isLoading = false }: TopicSelectorProps) {
  // Initialize with all topics selected by default
  const [selectedTopicIds, setSelectedTopicIds] = useState<Set<string>>(() => {
    return new Set(topics.map(topic => topic.id))
  })

  // Update selected topics when topics prop changes
  useEffect(() => {
    setSelectedTopicIds(new Set(topics.map(topic => topic.id)))
  }, [topics])

  const handleToggleTopic = (topicId: string) => {
    setSelectedTopicIds(prev => {
      const next = new Set(prev)
      if (next.has(topicId)) {
        next.delete(topicId)
      } else {
        next.add(topicId)
      }
      return next
    })
  }

  const handleGenerate = () => {
    // Ensure at least one topic is selected before generating
    if (selectedTopicIds.size === 0) {
      return
    }
    onGenerate(Array.from(selectedTopicIds))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg p-8 py-1">
        <h2 className="text-4xl text-center font-bold mb-6">Select Your Topics</h2>

        {/* Topics List */}
        <div className="mb-8 max-h-80 overflow-y-auto flex flex-col gap-4">
          {topics.map((topic) => {
            const isSelected = selectedTopicIds.has(topic.id)
            // Indent based on level: each level adds 1rem (16px) of padding

            return (
              <div
                key={topic.id}
                className={`relative flex flex-row items-center gap-2 bg-white rounded-2xl p-6 cursor-pointer transition-all duration-200 ${isSelected
                    ? 'border-3 border-[#893dff] shadow-lg'
                    : 'border-3 border-gray-200 hover:border-gray-300 hover:shadow-lg'
                  }`}
              >
                <label
                  htmlFor={`topic-${topic.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium text-gray-900">{topic.title}</div>
                  {topic.summary && (
                    <div className="text-sm text-gray-600 mt-1">{topic.summary}</div>
                  )}
                </label>
                <input
                  style={{ position: 'absolute', visibility: 'hidden' }}
                  type="checkbox"
                  id={`topic-${topic.id}`}
                  checked={isSelected}
                  onChange={() => handleToggleTopic(topic.id)}
                  className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                />
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${isSelected
                      ? 'bg-[#893dff] scale-100'
                      : 'border-2 border-gray-300 bg-white scale-100 hover:scale-105'
                    }`}
                >
                  {isSelected && (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}

                </div>
              </div>
            )
          })}
        </div>

        {/* Generate Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={handleGenerate}
            disabled={selectedTopicIds.size === 0 || isLoading}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${selectedTopicIds.size > 0 && !isLoading
                ? 'bg-[#893dff] text-white hover:bg-[#893dff] hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="text-gray-400" />
                <span>Generating Quiz...</span>
              </>
            ) : (
              'Generate Quiz'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

