import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { submitQuiz } from '../api/client'
import type { SubmitQuizRequest, SubmitQuizResponse } from '../types/quiz'

/**
 * Mutation hook for submitting quiz answers
 */
export function useSubmitQuiz(quizId: string) {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation<SubmitQuizResponse, Error, SubmitQuizRequest>({
    mutationFn: async (data: SubmitQuizRequest) => {
      const token = await getToken()
      return submitQuiz(quizId, data, token)
    },
    onSuccess: () => {
      // Invalidate quiz query to ensure fresh data after submission
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })
    },
  })
}

