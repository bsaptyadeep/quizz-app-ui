import { useQuery } from '@tanstack/react-query'
import { getQuizTopics } from '../api/client'
import type { TopicsResponse } from '../types/quiz'

/**
 * Fetches topics for a quiz by ID
 */
export function useQuizTopics(quizId: string | undefined) {
  return useQuery<TopicsResponse>({
    queryKey: ['quiz-topics', quizId],
    queryFn: () => {
      if (!quizId) {
        throw new Error('Quiz ID is required')
      }
      return getQuizTopics(quizId)
    },
    enabled: !!quizId,
  })
}

