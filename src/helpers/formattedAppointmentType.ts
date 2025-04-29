export const formattedAppointmentType = (status: string) => {
  switch (status) {
    case 'IN_PERSON':
      return 'Presencial'
    case 'PHONE':
      return 'Telefónica'
    default:
      console.error(`Unknown status: ${status}`)
      return status
  }
}
