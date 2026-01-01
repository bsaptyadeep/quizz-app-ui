import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useQuiz, useSubmitQuiz } from '../hooks'
import ProcessingUI from '../components/ProcessingUI'
import LoadingSpinner from '../components/LoadingSpinner'
import TopicSelectionScreen from '../components/TopicSelectionScreen'
import { useUser } from '@clerk/clerk-react'
import { useToastContext } from '../contexts/ToastContext'

export default function Quiz() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const { showToast } = useToastContext()
  const { data: quiz, isLoading, error } = useQuiz(quizId)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  
  // Store answers as number[] where each value is 0-3 (option index)
  // Array index corresponds to question index
  const [answers, setAnswers] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize submit mutation (only when quizId is available)
  const submitQuizMutation = useSubmitQuiz(quizId || '')
  
  // Authentication guard: redirect to home if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      showToast('Please sign in to continue', 'error')
      navigate('/')
    }
  }, [isSignedIn, navigate, showToast])
  
  // Initialize answers array when quiz is ready
  useEffect(() => {
    if (quiz?.questions && quiz.status === 'ready') {
      // Initialize with -1 to indicate no answer selected for each question
      setAnswers(new Array(quiz.questions.length).fill(-1))
    }
  }, [quiz])
  
  // Return null if not signed in (prevents rendering during redirect)
  if (!isSignedIn) {
    return null
  }

  // Show processing UI while loading or if quiz is processing
  if (isLoading || !quiz || quiz.status === 'processing') {
    return <ProcessingUI status={quiz?.status || 'processing'} />
  }

  // Show topic selection screen when quiz is processing topics
  if (quiz.status === 'processing_topics' && quizId) {
    return <TopicSelectionScreen quizId={quizId} />
  }

  // Show error state for network/API errors
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
            Failed to Load Quiz
          </h2>
          <p className="text-gray-600 mb-6">
            {error instanceof Error ? error.message : 'An error occurred while loading the quiz.'}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-[#720dff] text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Another Link
          </Link>
        </div>
      </div>
    )
  }

  // Show error if quiz generation failed
  if (quiz.status === 'failed') {
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
            Quiz Generation Failed
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't generate a quiz from the provided URL. Please try again with a different website.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-[#720dff] text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Another Link
          </Link>
        </div>
      </div>
    )
  }

  // Render quiz attempt UI when status is 'ready'
  // Ensure we have questions before rendering
  if (quiz.status !== 'ready' || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">Quiz is not ready yet.</p>
        </div>
      </div>
    )
  }

  // Map questions and ensure exactly 4 options per question
  const questions = quiz.questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options.slice(0, 4), // Ensure exactly 4 options
    correctAnswer: q.correctAnswer,
  }))

  const handleAnswerSelect = (optionIndex: number) => {
    // Ensure optionIndex is between 0-3
    if (optionIndex < 0 || optionIndex > 3) return
    
    // Ensure answers array is initialized
    if (answers.length !== questions.length) return
    
    // Update answers array: array index = question index, value = option index (0-3)
    // Only one option per question - replacing previous selection
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers]
      newAnswers[currentQuestion] = optionIndex
      return newAnswers
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const isLastQuestion = currentQuestion === questions.length - 1
  // Check if current question has an answer (value is 0-3, not -1 or undefined)
  const hasAnswer = 
    answers.length > currentQuestion && 
    answers[currentQuestion] !== undefined && 
    answers[currentQuestion] >= 0 && 
    answers[currentQuestion] <= 3

  // Check if all questions are answered
  // All answers must be valid (0-3) and array length must match questions length
  const allQuestionsAnswered = 
    answers.length === questions.length &&
    answers.every(answer => answer >= 0 && answer <= 3)

  // Submit button should be disabled if:
  // 1. Not all questions are answered
  // 2. Currently submitting
  const canSubmit = allQuestionsAnswered && !isSubmitting && !submitQuizMutation.isPending

  const handleSubmit = async () => {
    // Prevent duplicate submissions
    if (isSubmitting || submitQuizMutation.isPending) {
      return
    }

    // Ensure all questions are answered
    if (!allQuestionsAnswered) {
      return
    }

    // Ensure quizId is available
    if (!quizId) {
      return
    }

    setIsSubmitting(true)

    try {
      // Submit answers to API
      const submissionResult = await submitQuizMutation.mutateAsync({
        answers: answers,
      })
      
      // Store results in localStorage for direct access/refresh support
      if (quizId) {
        localStorage.setItem(`quiz-results-${quizId}`, JSON.stringify(submissionResult))
      }
      
      // Navigate to results page on success
      navigate(`/result/${quizId}`)
    } catch (error) {
      // Handle error - could show error message to user
      console.error('Failed to submit quiz:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Quiz Title */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
          <span className="font-medium">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-gray-500">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
          <div
            className="bg-[#720dff] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
        {/* Current Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
            {questions[currentQuestion].question}
          </h2>

          {/* Options - Exactly 4 options */}
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => {
              // Check if this option is selected (compare number directly)
              // Array index = question index, value = option index (0-3)
              const isSelected = 
                answers.length > currentQuestion && 
                answers[currentQuestion] === index
              const isDisabled = isSubmitting || submitQuizMutation.isPending
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isDisabled}
                  className={`w-full text-left p-5 rounded-lg border-2 transition-all duration-200 ${
                    isDisabled
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? 'border-[#720dff] bg-[#720dff]'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      )}
                    </div>
                    <span className={`text-base font-medium ${
                      isSelected ? 'text-indigo-900' : 'text-gray-900'
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || isSubmitting || submitQuizMutation.isPending}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentQuestion === 0 || isSubmitting || submitQuizMutation.isPending
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 opacity-60'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            ← Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                canSubmit
                  ? 'bg-[#720dff] text-white hover:bg-[#720dff] hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting || submitQuizMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                'Submit Quiz'
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAnswer || isSubmitting || submitQuizMutation.isPending}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                hasAnswer && !isSubmitting && !submitQuizMutation.isPending
                  ? 'bg-[#720dff] text-white hover:bg-[#720dff] hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center text-[#720dff] hover:text-[#720dff] font-medium transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

