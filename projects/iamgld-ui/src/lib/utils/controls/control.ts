export function updateValueWithMask({ mask, value }: { mask: string; value: string }): string {
  if (!value) return value

  let accumulate = 0
  const maskApplied: string[] = []
  value.split('').map((character, index) => {
    const placeholder = mask.split('')[index + accumulate]
    if (placeholder === '0' || character === placeholder) maskApplied.push(character)
    else {
      maskApplied.push(placeholder)
      maskApplied.push(character)
      accumulate += 1
    }
  })
  return maskApplied.join('')
}
