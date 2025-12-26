import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitQuiz } from '../api/client'
import type { SubmitQuizRequest, SubmitQuizResponse } from '../types/quiz'

/**
 * Mutation hook for submitting quiz answers
 */
export function useSubmitQuiz(quizId: string) {
  const queryClient = useQueryClient()

  return useMutation<SubmitQuizResponse, Error, SubmitQuizRequest>({
    mutationFn: (data: SubmitQuizRequest) => submitQuiz(quizId, data),
    onSuccess: () => {
      // Invalidate quiz query to ensure fresh data after submission
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })
    },
  })
}

