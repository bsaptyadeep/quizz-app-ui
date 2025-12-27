import type { QuizStatus } from '../types/quiz'

interface ProcessingUIProps {
  status?: QuizStatus
}

export default function ProcessingUI({ status = 'processing' }: ProcessingUIProps) {
  // Get message based on quiz status
  const getMessage = (quizStatus: QuizStatus): string => {
    switch (quizStatus) {
      case 'processing':
        return 'Analyzing website'
      case 'processing_topics':
        return 'Organizing topics'
      default:
        return 'Preparing quiz questions'
    }
  }

  const message = getMessage(status)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        {/* Loader Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        </div>

        {/* Message */}
        <div className="mb-4 min-h-[2rem] flex items-center justify-center">
          <p className="text-xl font-semibold text-gray-900 animate-fade-in">
            {message}
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

