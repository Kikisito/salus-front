export interface ApiError {
  message: string
  errors: {
    code: string
    message: string
  }[]
  timestamp: string
}
