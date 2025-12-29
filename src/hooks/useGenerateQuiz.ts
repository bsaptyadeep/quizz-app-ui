import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { generateQuizFromTopics } from '../api/client'

interface GenerateQuizInput {
  topicIds: string[]
  difficulty?: 'easy' | 'medium' | 'hard'
}

/**
 * Mutation hook for generating a quiz from selected topics
 */
export function useGenerateQuiz(quizId: string) {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation<any, Error, GenerateQuizInput>({
    mutationFn: async (data: GenerateQuizInput) => {
      const token = await getToken()
      return generateQuizFromTopics(quizId, data.topicIds, data.difficulty || 'medium', token)
    },
    onSuccess: () => {
      // Invalidate quiz query to ensure fresh data after generation
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })
    },
  })
}

