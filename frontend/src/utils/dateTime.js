export const dateTime = (milliSeconds) => {
  const date = new Date(milliSeconds)
  return date.toLocaleString()
}
