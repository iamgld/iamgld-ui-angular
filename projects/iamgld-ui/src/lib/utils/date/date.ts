export const YEAR_LENGTH = 4
export const MIN_MONTH = 1
export const MAX_MONTH = 12
export const MIN_DAY = 1
export const MAX_DAY = 31

export function formatDateToISODate(options: { date: string | Date }): string | null {
  const { date } = options

  // If it's a numeric string (timestamp in seconds)
  if (typeof date === 'string' && /^\d+$/.test(date)) {
    // If it has 10 digits, it's a timestamp in seconds
    if (date.length === 10) {
      const ms = Number.parseInt(date, 10) * 1000
      const _date = new Date(ms)
      return _date.toISOString().split('T')[0]
    }
    // If it has 13 digits, it's a timestamp in milliseconds
    if (date.length === 13 || date.length === 12) {
      const ms = Number.parseInt(date, 10)
      const _date = new Date(ms)
      return _date.toISOString().split('T')[0]
    }

    return null
  }

  const isValidDate = !Number.isNaN(new Date(date).getTime())

  // It isn't a valid date
  if (!isValidDate) return null

  // If it's a Date or date string
  const _date = new Date(date)
  return _date.toISOString().split('T')[0]
}

export function formatISODateToDate(options: { date: string }): Date | null {
  const { date } = options

  const isValidDate = !Number.isNaN(new Date(date).getTime())
  // It isn't a valid date
  if (!isValidDate) return null

  // If it's a Date or date string
  const [year, month, day] = date.split('-').map(Number)
  const _date = new Date(year, month - 1, day)
  // Hora local, pero sin problemas de zona horaria
  return _date
}

export function formatDDMMYYYYToISODate(options: { date: string | null }): string | null {
  const { date } = options

  // It isn't a valid date
  if (!date) return null
  const [day, month, year] = date.split('/').map(Number)
  // It isn't a valid date
  if (
    !day ||
    day < MIN_DAY ||
    day > MAX_DAY ||
    !month ||
    month < MIN_MONTH ||
    month > MAX_MONTH ||
    !year ||
    String(year).length < YEAR_LENGTH
  )
    return null
  // Create the date and subtract 1 so that JavaScript interprets the month correctly
  const _date = new Date(Date.UTC(year, month - 1, day))

  return formatDateToISODate({ date: _date })
}

export function formatISODateToDDMMYYYY(options: { date: string }): string | null {
  const { date } = options

  const isValidDate = !Number.isNaN(new Date(date).getTime())

  // It isn't a valid date
  if (!isValidDate) return null

  // If it's a Date or date string
  const _date = new Date(date)
  const year = _date.getUTCFullYear()
  const month = String(_date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(_date.getUTCDate()).padStart(2, '0')
  return `${day}/${month}/${year}`
}

export function addDaysToISODate(options: { date: string | Date; days: number }): string | null {
  const { date, days } = options

  const isValidDate = !Number.isNaN(new Date(date).getTime())

  // It isn't a valid date
  if (!isValidDate) return null

  // It's a valid date
  const _date = new Date(date)
  _date.setUTCDate(_date.getUTCDate() + days)
  return _date.toISOString().split('T')[0]
}

export function addYearsToISODate(options: { date: string | Date; years: number }): string | null {
  const { date, years } = options

  const isValidDate = !Number.isNaN(new Date(date).getTime())

  // It isn't a valid date
  if (!isValidDate) return null

  // It's a valid date
  const _date = new Date(date)
  _date.setUTCFullYear(_date.getUTCFullYear() + years)
  return _date.toISOString().split('T')[0]
}
