import type {
  CreateQuizRequest,
  CreateQuizResponse,
  Quiz,
  SubmitQuizRequest,
  SubmitQuizResponse,
  TopicsResponse,
  ApiError,
} from '../types/quiz'

const API_BASE_URL = 'http://localhost:8080/api'

/**
 * Maps HTTP status codes to user-friendly error messages
 */
function getErrorMessage(status: number, backendMessage?: string): string {
  switch (status) {
    case 400:
      // Use backend validation message if available, otherwise generic message
      return backendMessage || 'Invalid request. Please check your input and try again.'
    case 404:
      return 'Quiz not found'
    case 429:
      return 'Rate limit exceeded. Please wait a moment before trying again.'
    case 500:
      return 'Server error. Please try again later.'
    default:
      // For other status codes, use backend message if available, otherwise generic
      return backendMessage || 'An error occurred. Please try again.'
  }
}

/**
 * Handles API errors and extracts readable error messages
 * Ensures raw JSON errors are never shown to users
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let backendMessage: string | undefined
    
    // Try to extract error message from backend response
    try {
      const errorData = await response.json()
      
      // Safely extract message from various possible response formats
      if (errorData && typeof errorData === 'object') {
        if (typeof errorData.message === 'string') {
          backendMessage = errorData.message
        } else if (typeof errorData.error === 'string') {
          backendMessage = errorData.error
        } else if (typeof errorData.detail === 'string') {
          backendMessage = errorData.detail
        }
      } else if (typeof errorData === 'string') {
        backendMessage = errorData
      }
    } catch {
      // If response is not JSON or parsing fails, use status-based message
      backendMessage = undefined
    }

    // Map status code to user-friendly message
    // Never expose raw JSON or technical error details
    const errorMessage = getErrorMessage(response.status, backendMessage)

    const error: ApiError = {
      message: errorMessage,
      status: response.status,
    }
    throw error
  }

  return response.json()
}

/**
 * Creates a new quiz from a source URL
 */
export async function createQuiz(
  data: CreateQuizRequest
): Promise<CreateQuizResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return handleResponse<CreateQuizResponse>(response)
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      throw error as ApiError
    }
    throw {
      message: 'Failed to create quiz. Please check your connection and try again.',
    } as ApiError
  }
}

/**
 * Fetches a quiz by ID
 */
export async function getQuiz(quizId: string): Promise<Quiz> {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`)

    return handleResponse<Quiz>(response)
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      throw error as ApiError
    }
    throw {
      message: `Failed to fetch quiz. Please check your connection and try again.`,
    } as ApiError
  }
}

/**
 * Fetches topics for a quiz by ID
 */
export async function getQuizTopics(quizId: string): Promise<TopicsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/topics`)

    return handleResponse<TopicsResponse>(response)
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      throw error as ApiError
    }
    throw {
      message: `Failed to fetch quiz topics. Please check your connection and try again.`,
    } as ApiError
  }
}

/**
 * Generates a quiz from selected topics
 */
export async function generateQuizFromTopics(
  quizId: string,
  topicIds: string[],
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topicIds, difficulty }),
    })

    return handleResponse<any>(response)
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      throw error as ApiError
    }
    throw {
      message: 'Failed to generate quiz from topics. Please check your connection and try again.',
    } as ApiError
  }
}

/**
 * Submits quiz answers and returns results
 */
export async function submitQuiz(
  quizId: string,
  data: SubmitQuizRequest
): Promise<SubmitQuizResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return handleResponse<SubmitQuizResponse>(response)
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      throw error as ApiError
    }
    throw {
      message: 'Failed to submit quiz. Please check your connection and try again.',
    } as ApiError
  }
}

