import { useMutation, useQueryClient } from '@tanstack/react-query'
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

  return useMutation<any, Error, GenerateQuizInput>({
    mutationFn: (data: GenerateQuizInput) => generateQuizFromTopics(quizId, data.topicIds, data.difficulty || 'medium'),
    onSuccess: () => {
      // Invalidate quiz query to ensure fresh data after generation
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })
    },
  })
}

