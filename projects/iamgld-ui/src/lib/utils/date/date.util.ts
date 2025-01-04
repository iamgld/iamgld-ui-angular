export function formatDateToISO(outerDate: string | Date): string | null {
	const date = new Date(outerDate)
	if (!isNaN(date.getTime())) return date.toISOString()
	else return null
}

// export function formatDateFromISOToDDMMYYYY(dateAsString: string): string | null {
// 	const [year, month, day] = dateAsString.split('-')
// 	if (year && month && day) return `${day}/${month}/${year}`
// 	else return null
// }

export function formatDateFromISOToYYYYMMDD(dateAsString: string | null): string | null {
	if (!dateAsString) return null
	const [date] = dateAsString.split('T')

	if (date) return date
	else return null
}

export function getDateWithOffsetInYears({ years }: { years: number }): Date {
	const today = new Date()
	today.setFullYear(today.getFullYear() + years) // Agrega o resta años
	return today
}

