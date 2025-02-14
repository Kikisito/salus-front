import { AxiosError } from 'axios'
import {
  createErrorServiceAnswer,
  createSucessServiceAnswer,
  type ServiceAnswer,
} from 'src/interfaces/ServiceAnswer'

export async function handleRequest<T>(
  request: () => Promise<T>,
  customErrorHandler?: (axiosError: AxiosError) => string | undefined,
): Promise<ServiceAnswer<T>> {
  try {
    const response = await request()
    return createSucessServiceAnswer(response)
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.code === 'ERR_NETWORK') {
        return createErrorServiceAnswer('No se ha podido establecer conexión con el servidor')
      } else {
        const message = customErrorHandler ? customErrorHandler(error) : undefined
        return customErrorHandler
          ? createErrorServiceAnswer(message || 'Ha ocurrido un error inesperado')
          : createErrorServiceAnswer('Ha ocurrido un error inesperado')
      }
    } else {
      console.error(error)
      return createErrorServiceAnswer('Ha ocurrido un error inesperado')
    }
  }
}
