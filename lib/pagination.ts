export function readPage(value: string | undefined) {
  if (typeof value !== 'string') return 1
  const page = Number(value)
  return Number.isSafeInteger(page) && page > 0 && page <= 1_000_000 ? page : 1
}
