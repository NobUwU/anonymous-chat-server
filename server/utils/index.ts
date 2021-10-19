export function typeCheck(value: unknown, type: 'string' | 'number', required = true): boolean {
  if (!required && !value) return true
  if (typeof value !== type) return false
  if (typeof value === 'string' && !value.length) return false

  return true
}
