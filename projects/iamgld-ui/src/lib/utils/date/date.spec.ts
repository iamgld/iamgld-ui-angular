import {
  addDaysToISODate,
  addYearsToISODate,
  formatDateToISODate,
  formatDDMMYYYYToISODate,
  formatISODateToDate,
  formatISODateToDDMMYYYY,
} from './date'

describe('date utils', () => {
  describe('formatDateToISODate', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(formatDateToISODate({ date: '2024-12-25' })).toBe('2024-12-25')
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(formatDateToISODate({ date: new Date('2024-06-15T10:00:00.000Z') })).toBe(
        '2024-06-15',
      )
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(formatDateToISODate({ date: 'invalid-date' })).toBeNull()
      expect(formatDateToISODate({ date: undefined as unknown as string })).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(formatDateToISODate({ date: '1704067200' })).toBe('2024-01-01')
      expect(formatDateToISODate({ date: '1704067200000' })).toBe('2024-01-01')
      expect(formatDateToISODate({ date: '170406720000' })).toBe('1975-05-27')
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(formatDateToISODate({ date: '12345' })).toBeNull()
      expect(formatDateToISODate({ date: '9999999999999999999999999' })).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(formatDateToISODate({ date: '' })).toBeNull()
      expect(formatDateToISODate({ date: [] as unknown as string })).toBeNull()
      expect(formatDateToISODate({ date: null as unknown as string })).toBe('1970-01-01')
    })
  })

  describe('formatISODateToDate', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      const result = formatISODateToDate({ date: '2025-02-17' })
      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2025)
      expect(result?.getMonth()).toBe(1)
      expect(result?.getDate()).toBe(17)
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(formatISODateToDate({ date: 'not-a-date' })).toBeNull()
      expect(formatISODateToDate({ date: undefined as unknown as string })).toBeNull()
    })
  })

  describe('formatDDMMYYYYToISODate', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(formatDDMMYYYYToISODate({ date: '31/12/2024' })).toBe('2024-12-31')
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(formatDDMMYYYYToISODate({ date: null })).toBeNull()
      expect(formatDDMMYYYYToISODate({ date: '0/12/2024' })).toBeNull()
      expect(formatDDMMYYYYToISODate({ date: '01/13/2024' })).toBeNull()
      expect(formatDDMMYYYYToISODate({ date: '01/12/24' })).toBeNull()
      expect(formatDDMMYYYYToISODate({ date: '' })).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(formatDDMMYYYYToISODate({ date: '31/02/2024' })).toBe('2024-03-02')
    })
  })

  describe('formatISODateToDDMMYYYY', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(formatISODateToDDMMYYYY({ date: '2024-05-09' })).toBe('09/05/2024')
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(formatISODateToDDMMYYYY({ date: '---' })).toBeNull()
      expect(formatISODateToDDMMYYYY({ date: undefined as unknown as string })).toBeNull()
    })
  })

  describe('addDaysToISODate', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(addDaysToISODate({ date: '2024-01-01', days: 1 })).toBe('2024-01-02')
      expect(addDaysToISODate({ date: '2024-01-01', days: -1 })).toBe('2023-12-31')
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(addDaysToISODate({ date: 'invalid', days: 10 })).toBeNull()
    })
  })

  describe('addYearsToISODate', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(addYearsToISODate({ date: '2000-02-29', years: 1 })).toBe('2001-03-01')
      expect(addYearsToISODate({ date: '2000-01-01', years: 0 })).toBe('2000-01-01')
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      expect(addYearsToISODate({ date: 'invalid', years: 1 })).toBeNull()
    })
  })
})
