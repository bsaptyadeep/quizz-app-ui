import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateQuiz } from '../hooks'
import LoadingSpinner from '../components/LoadingSpinner'
import { useUser, SignInButton } from '@clerk/clerk-react'
import { Link2 } from 'lucide-react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const navigate = useNavigate()
  const createQuizMutation = useCreateQuiz()
  const { isSignedIn } = useUser()

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

    // Require authentication
    if (!isSignedIn) {
      return
    }

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
          Turn any website into an interactive quiz
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Transform any website into an interactive quiz. Simply paste a URL and let AI create questions based on the content.
        </p>
      </div>

      {/* Quiz Generation Form */}
      <div className="bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={`
          flex items-center w-full bg-white border border-gray-200 
          rounded-full shadow-sm p-1.5 transition-all duration-300
          hover:shadow-md focus-within:shadow-md focus-within:border-gray-300
        `}>
            {/* Link Icon */}
            <div className="pl-4 pr-2 text-gray-400">
              <Link2 size={20} strokeWidth={1.5} />
            </div>

            {/* Input Field */}
            <input
              type="url"
              id="url"
              value={url}
              onChange={handleUrlChange}
              disabled={createQuizMutation.isPending}
              aria-invalid={hasError}
              aria-describedby={hasError ? 'url-error' : undefined}
              placeholder="Paste website URL (e.g., notion.so/article...)"
              className="flex-grow bg-transparent border-none outline-none py-3 px-1 text-slate-700 placeholder:text-gray-400 text-[15px] font-normal"
            />

            {/* Action Button */}
            <button
              type="submit"
              disabled={!isSignedIn || createQuizMutation.isPending || hasValidationError}
              className={`
              flex items-center space-x-2 px-6 py-2.5 rounded-full 
              font-medium text-white text-[15px] transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              bg-gradient-to-r from-[#6344F5] to-[#8C52FF]
              hover:from-[#5536E8] hover:to-[#7B42E8]
              active:scale-[0.98]
            `}
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
          </div>

          <p className="mt-3.5 text-slate-400 text-[13px] font-normal tracking-tight text-center">
            Public websites only
          </p>

          {/* Authentication Message */}
          {!isSignedIn && (
            <div
              className="bg-[#f0ecff] border-2 border-[#720dff] rounded-lg p-2 pl-4"
              role="alert"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <svg
                    className="w-5 h-5 text-[#720dff] mt-0.5 mr-3 flex-shrink-0"
                    fill="#6344F5"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-[#720dff]">Please sign in to create a quiz</p>
                </div>
                <SignInButton mode="modal">
                  <button className="ml-4 px-4 py-2 bg-[#720dff] text-white text-sm rounded-md transition-colors font-medium whitespace-nowrap cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </div>
          )}

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
        </form>
      </div>
    </div>
  )
}


// http://localhost:5173/quiz/641ce8da-147a-4705-9190-4e9b327ca97a
