export function capitalizeFirstLetter(str: string): string {
	if (!str) return str // Maneja el caso de string vacío
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

