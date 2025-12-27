import { useState, useEffect } from 'react'
import type { Topic } from '../types/quiz'

interface TopicSelectorProps {
  topics: Topic[]
  onGenerate: (topicIds: string[]) => void
}

export default function TopicSelector({ topics, onGenerate }: TopicSelectorProps) {
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
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Topics</h2>

        {/* Topics List */}
        <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
          {topics.map((topic) => {
            const isSelected = selectedTopicIds.has(topic.id)
            // Indent based on level: each level adds 1rem (16px) of padding
            const indentLevel = topic.level * 16

            return (
              <div
                key={topic.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ paddingLeft: `${indentLevel + 12}px` }}
              >
                <input
                  type="checkbox"
                  id={`topic-${topic.id}`}
                  checked={isSelected}
                  onChange={() => handleToggleTopic(topic.id)}
                  className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                />
                <label
                  htmlFor={`topic-${topic.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium text-gray-900">{topic.title}</div>
                  {topic.summary && (
                    <div className="text-sm text-gray-600 mt-1">{topic.summary}</div>
                  )}
                </label>
              </div>
            )
          })}
        </div>

        {/* Generate Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={handleGenerate}
            disabled={selectedTopicIds.size === 0}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedTopicIds.size > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Generate Quiz
          </button>
        </div>
      </div>
    </div>
  )
}

