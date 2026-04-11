export function capitalizeFirstLetter(value: string): string {
  if (!value) return value // Catch when the value is empty
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}
