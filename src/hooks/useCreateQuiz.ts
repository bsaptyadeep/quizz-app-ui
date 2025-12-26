import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createQuiz } from '../api/client'
import type { CreateQuizRequest, CreateQuizResponse } from '../types/quiz'

/**
 * Mutation hook for creating a new quiz from a source URL
 */
export function useCreateQuiz() {
  const queryClient = useQueryClient()

  return useMutation<CreateQuizResponse, Error, CreateQuizRequest>({
    mutationFn: createQuiz,
    onSuccess: (data) => {
      // Invalidate and refetch quiz queries when a new quiz is created
      // This ensures the quiz list stays up to date
      queryClient.invalidateQueries({ queryKey: ['quiz'] })
    },
  })
}

