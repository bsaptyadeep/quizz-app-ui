import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { createQuiz } from '../api/client'
import type { CreateQuizRequest, CreateQuizResponse } from '../types/quiz'

/**
 * Mutation hook for creating a new quiz from a source URL
 */
export function useCreateQuiz() {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation<CreateQuizResponse, Error, CreateQuizRequest>({
    mutationFn: async (data) => {
      const token = await getToken()
      return createQuiz(data, token)
    },
    onSuccess: (data) => {
      // Invalidate and refetch quiz queries when a new quiz is created
      // This ensures the quiz list stays up to date
      queryClient.invalidateQueries({ queryKey: ['quiz'] })
    },
  })
}

