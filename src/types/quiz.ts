export type QuizStatus = 'processing' | 'processing_topics' | 'ready' | 'failed'

export interface CreateQuizRequest {
  source_url: string
}

export interface CreateQuizResponse {
  quiz_id: string
  status: QuizStatus
  message: string
}

export interface Topic {
  id: string
  title: string
  summary: string | null
  level: number
  tokenEstimate: number
}

export interface TopicsResponse {
  quizId: string
  topics: Topic[]
}

export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

export interface Quiz {
  id: string
  sourceUrl: string
  title: string
  questions: Question[]
  status: QuizStatus
  createdAt: string
}

export interface SubmitQuizRequest {
  answers: number[]
}

export interface QuizResult {
  questionId: number
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
}

export interface SubmitQuizResponse {
  score: number
  correctCount: number
  percentage: number
  results: QuizResult[]
}

export interface ApiError {
  message: string
  status?: number
}

