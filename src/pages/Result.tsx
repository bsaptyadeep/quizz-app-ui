import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useQuiz } from '../hooks'
import { useToastContext } from '../contexts/ToastContext'
import type { SubmitQuizResponse } from '../types/quiz'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Result() {
  const { quizId } = useParams<{ quizId: string }>()
  const { isLoading: isLoadingQuiz, error: quizError } = useQuiz(quizId)
  const { showToast } = useToastContext()
  const [submissionResult, setSubmissionResult] = useState<SubmitQuizResponse | null>(null)
  const [isLoadingResults, setIsLoadingResults] = useState(true)

  // Copy quiz link to clipboard with toast notification
  const handleCopyLink = async () => {
    if (!quizId) return

    const quizUrl = `${window.location.origin}/quiz/${quizId}`
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(quizUrl)
        showToast('Quiz link copied to clipboard!', 'success')
        return
      }
      
      // Fallback for older browsers
      throw new Error('Clipboard API not available')
    } catch (err) {
      // Fallback method for older browsers or when clipboard API fails
      try {
        const textArea = document.createElement('textarea')
        textArea.value = quizUrl
        textArea.style.position = 'fixed'
        textArea.style.top = '0'
        textArea.style.left = '0'
        textArea.style.opacity = '0'
        textArea.style.pointerEvents = 'none'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (successful) {
          showToast('Quiz link copied to clipboard!', 'success')
        } else {
          throw new Error('execCommand failed')
        }
      } catch (fallbackErr) {
        // If all methods fail, show error toast
        console.error('Failed to copy link:', fallbackErr)
        showToast('Failed to copy link. Please copy manually.', 'error')
      }
    }
  }

  // Load results from localStorage (stored when quiz was submitted)
  useEffect(() => {
    if (quizId) {
      try {
        const storedResults = localStorage.getItem(`quiz-results-${quizId}`)
        if (storedResults) {
          const parsed = JSON.parse(storedResults) as SubmitQuizResponse
          setSubmissionResult(parsed)
        }
      } catch (error) {
        console.error('Failed to load results from storage:', error)
      } finally {
        setIsLoadingResults(false)
      }
    } else {
      setIsLoadingResults(false)
    }
  }, [quizId])

  // Show loading state while fetching quiz data or results
  if (isLoadingQuiz || isLoadingResults) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <LoadingSpinner size="lg" className="text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  // Show error if quiz failed to load
  if (quizError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Failed to Load Quiz
          </h2>
          <p className="text-gray-600 mb-6">
            {quizError instanceof Error ? quizError.message : 'An error occurred while loading the quiz.'}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // If no submission result, show message
  if (!submissionResult) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Results Available
          </h2>
          <p className="text-gray-600 mb-6">
            {quizId 
              ? 'Please complete this quiz to see your results.'
              : 'Please complete a quiz to see your results.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {quizId && (
              <Link
                to={`/quiz/${quizId}`}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center font-medium"
              >
                Take Quiz
              </Link>
            )}
            <Link
              to="/"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Extract data from submission result
  const percentage = submissionResult.percentage
  const correctCount = submissionResult.correctCount
  const totalQuestions = submissionResult.results.length
  const isSuccess = percentage >= 60 // Consider 60%+ as success

  // Get score colors based on percentage
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Result Header */}
        <div className="text-center mb-8">
          {/* Visual Success/Failure Indicator */}
          <div className="mb-6">
            {isSuccess ? (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Percentage Score */}
          <div
            className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(
              percentage
            )} mb-4`}
          >
            <span className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
              {percentage}%
            </span>
          </div>

          {/* Correct Count / Total Questions */}
          <p className="text-xl font-semibold text-gray-700 mb-2">
            {correctCount} out of {totalQuestions} questions correct
          </p>
          <p className="text-lg text-gray-600">
            {isSuccess ? 'Great job! 🎉' : 'Keep practicing! 💪'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {correctCount}/{totalQuestions}
            </div>
            <div className="text-gray-600 font-medium">Correct Answers</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-gray-600 font-medium">Score</div>
          </div>
        </div>

        {/* Performance Message */}
        <div className={`border rounded-lg p-6 mb-8 ${
          isSuccess
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-2 ${
            isSuccess ? 'text-green-900' : 'text-red-900'
          }`}>
            {percentage >= 80
              ? 'Excellent Work! 🎉'
              : percentage >= 60
              ? 'Good Job! 👍'
              : 'Keep Practicing! 💪'}
          </h2>
          <p className={isSuccess ? 'text-green-700' : 'text-red-700'}>
            {percentage >= 80
              ? "You've mastered this quiz! Consider trying a more challenging one."
              : percentage >= 60
              ? "You're on the right track! Review the questions you missed and try again."
              : "Don't worry! Review the material and try the quiz again to improve your score."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCopyLink}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Quiz Link
            </button>
            <Link
              to={`/quiz/${quizId}`}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center font-medium"
            >
              Retake Quiz
            </Link>
            <Link
              to="/"
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
            >
              Create New Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

