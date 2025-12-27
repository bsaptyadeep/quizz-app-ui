import { useQuery } from '@tanstack/react-query'
import { getQuiz } from '../api/client'
import type { Quiz } from '../types/quiz'

/**
 * Fetches a quiz by ID with polling support
 * Polls every 2000ms while status is 'processing'
 * Stops polling when status is 'processing_topics' (waiting for user to select topics),
 * 'ready', or 'failed'
 */
export function useQuiz(quizId: string | undefined) {
  return useQuery<Quiz>({
    queryKey: ['quiz', quizId],
    queryFn: () => {
      if (!quizId) {
        throw new Error('Quiz ID is required')
      }
      return getQuiz(quizId)
    },
    enabled: !!quizId,
    refetchInterval: (query) => {
      const data = query.state.data
      // Poll every 2000ms only while status is 'processing'
      // Don't poll when status is 'processing_topics' (waiting for user action)
      if (data?.status === 'processing') {
        return 2000
      }
      // Stop polling when status is 'processing_topics', 'ready', or 'failed'
      return false
    },
  })
}

