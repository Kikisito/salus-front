export const formattedStatus = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Pendiente'
    case 'COMPLETED':
      return 'Finalizada'
    case 'ABSENT':
      return 'No asistió'
    default:
      console.error(`Unknown status: ${status}`)
      return status
  }
}
