import { useQuizTopics } from '../hooks/useQuizTopics'
import { useGenerateQuiz } from '../hooks/useGenerateQuiz'
import TopicSelector from './TopicSelector'
import LoadingSpinner from './LoadingSpinner'

interface TopicSelectionScreenProps {
  quizId: string
}

export default function TopicSelectionScreen({ quizId }: TopicSelectionScreenProps) {
  const { data: topicsData, isLoading, error } = useQuizTopics(quizId)
  const generateQuizMutation = useGenerateQuiz(quizId)

  const handleGenerate = (topicIds: string[]) => {
    // Prevent generating quiz with no topics selected
    if (!topicIds || topicIds.length === 0) {
      return
    }
    // Default difficulty to 'medium' - can be made configurable later
    generateQuizMutation.mutate({ topicIds, difficulty: 'medium' })
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading topics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Topics
          </h2>
          <p className="text-gray-600 mb-6">
            {error instanceof Error ? error.message : 'An error occurred while loading topics.'}
          </p>
        </div>
      </div>
    )
  }

  if (!topicsData || !topicsData.topics || topicsData.topics.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">No topics available.</p>
        </div>
      </div>
    )
  }

  return (
    <TopicSelector
      topics={topicsData.topics}
      onGenerate={handleGenerate}
      isLoading={generateQuizMutation.isPending}
    />
  )
}

