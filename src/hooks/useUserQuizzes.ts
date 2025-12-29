import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { getUserQuizzes } from '../api/client'
import type { Quiz } from '../types/quiz'

/**
 * Fetches all quizzes for the current user
 */
export function useUserQuizzes() {
  const { getToken, isSignedIn } = useAuth()

  return useQuery<Quiz[]>({
    queryKey: ['user-quizzes'],
    queryFn: async () => {
      const token = await getToken()
      return getUserQuizzes(token)
    },
    enabled: isSignedIn ?? false,
  })
}

