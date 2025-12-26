import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateQuiz } from '../hooks'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home() {
  const [url, setUrl] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const navigate = useNavigate()
  const createQuizMutation = useCreateQuiz()

  /**
   * Validates URL format
   * Returns error message if invalid, null if valid
   */
  const validateUrl = (urlValue: string): string | null => {
    const trimmedUrl = urlValue.trim()

    // Check for empty input
    if (!trimmedUrl) {
      return 'Please enter a URL'
    }

    // Check URL format - must start with http:// or https://
    try {
      const urlObj = new URL(trimmedUrl)
      // Ensure it's http or https protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return 'URL must start with http:// or https://'
      }
    } catch {
      // URL constructor throws if invalid
      return 'Please enter a valid URL (e.g., https://example.com)'
    }

    return null
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null)
    }
    // Clear API error when user modifies input
    if (apiError) {
      setApiError(null)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setValidationError(null)
    setApiError(null)

    // Validate URL format
    const validationResult = validateUrl(url)
    if (validationResult) {
      setValidationError(validationResult)
      return
    }

    try {
      const result = await createQuizMutation.mutateAsync({
        source_url: url.trim(),
      })
      
      // Navigate to quiz page after successful creation using returned quiz_id
      navigate(`/quiz/${result.quiz_id}`)
    } catch (err) {
      // Handle API errors - extract backend error messages
      if (err && typeof err === 'object' && 'message' in err) {
        const apiError = err as { message: string; status?: number }
        
        // Use backend error message for 400 (Bad Request) and 429 (Too Many Requests)
        // The API client already extracts readable messages from backend responses
        setApiError(apiError.message)
      } else {
        setApiError('Failed to generate quiz. Please check your connection and try again.')
      }
    }
  }

  // Determine which error to display (validation takes precedence)
  const displayError = validationError || apiError
  const hasError = !!displayError
  // Only block submission for validation errors, not API errors
  const hasValidationError = !!validationError

  return (
    <div className="max-w-2xl mx-auto">
      {/* Headline Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Generate Quizzes from Websites
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Transform any website into an interactive quiz. Simply paste a URL and let AI create questions based on the content.
        </p>
      </div>

      {/* Quiz Generation Form */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input Field */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com/article"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-400 transition-colors ${
                createQuizMutation.isPending
                  ? 'border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
                  : hasError
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-indigo-500'
              }`}
              disabled={createQuizMutation.isPending}
              aria-invalid={hasError}
              aria-describedby={hasError ? 'url-error' : undefined}
            />
            {/* Helper Text */}
            <p className={`text-sm mt-1 ${hasError ? 'text-red-600' : 'text-gray-500'}`}>
              Public websites only
            </p>
          </div>

          {/* Inline Validation Error Message */}
          {displayError && (
            <div
              id="url-error"
              className="bg-red-50 border border-red-200 rounded-lg p-4"
              role="alert"
            >
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-800">{displayError}</p>
              </div>
            </div>
          )}

          {/* Generate Quiz Button */}
          <button
            type="submit"
            disabled={createQuizMutation.isPending || hasValidationError}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {createQuizMutation.isPending ? (
              <>
                <LoadingSpinner size="md" className="text-white" />
                <span>Generating Quiz...</span>
              </>
            ) : (
              'Generate Quiz'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

