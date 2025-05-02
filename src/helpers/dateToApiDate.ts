export default function dateToApiDate(date: Date) {
  // YYYY-MM-DD EN LOCAL DATE TIME
  if (date === undefined || date === null) {
    return ''
  }

  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
