import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { getQuizTopics } from '../api/client'
import type { TopicsResponse } from '../types/quiz'

/**
 * Fetches topics for a quiz by ID
 */
export function useQuizTopics(quizId: string | undefined) {
  const { getToken } = useAuth()

  return useQuery<TopicsResponse>({
    queryKey: ['quiz-topics', quizId],
    queryFn: async () => {
      if (!quizId) {
        throw new Error('Quiz ID is required')
      }
      const token = await getToken()
      return getQuizTopics(quizId, token)
    },
    enabled: !!quizId,
  })
}

