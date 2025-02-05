export type ServiceAnswer<T> = { success: true; data: T } | { success: false; error: string }

export function createSucessServiceAnswer<T>(data: T): ServiceAnswer<T> {
  return { success: true, data }
}

export function createErrorServiceAnswer<T>(error: string): ServiceAnswer<T> {
  return { success: false, error }
}
