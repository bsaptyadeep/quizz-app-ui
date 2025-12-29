import { Link } from 'react-router-dom'
import { useUserQuizzes } from '../hooks/useUserQuizzes'
import LoadingSpinner from '../components/LoadingSpinner'
import type { QuizStatus } from '../types/quiz'

/**
 * Get status badge styling based on quiz status
 */
function getStatusBadgeClass(status: QuizStatus): string {
  switch (status) {
    case 'ready':
      return 'bg-green-100 text-green-800'
    case 'processing':
    case 'processing_topics':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Get status display text
 */
function getStatusText(status: QuizStatus): string {
  switch (status) {
    case 'processing':
      return 'Processing'
    case 'processing_topics':
      return 'Selecting Topics'
    case 'ready':
      return 'Ready'
    case 'failed':
      return 'Failed'
    default:
      return status
  }
}

export default function MyQuizzes() {
  const { data: quizzes, isLoading, error } = useUserQuizzes()

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <LoadingSpinner size="lg" className="text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
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
            Failed to Load Quizzes
          </h2>
          <p className="text-gray-600 mb-6">
            {error instanceof Error ? error.message : 'An error occurred while loading quizzes.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Quizzes</h1>
        <p className="text-gray-600">View and manage all your quizzes</p>
      </div>

      {!quizzes || quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No quizzes yet</h2>
          <p className="text-gray-600 mb-6">
            Create your first quiz to get started!
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Create Quiz
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {quiz.title || `Quiz ${quiz.id.slice(0, 8)}`}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      Created: {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                    {quiz.status === 'ready' && quiz.questions && (
                      <span>{quiz.questions.length} questions</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                      quiz.status
                    )}`}
                  >
                    {getStatusText(quiz.status)}
                  </span>
                  {(quiz.status === 'ready' || quiz.status === 'processing_topics') && (
                    <Link
                      to={`/quiz/${quiz.id}`}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      {quiz.status === 'ready' ? 'Take Quiz' : 'Select Topics'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

