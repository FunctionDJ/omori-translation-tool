export async function getArrayFromAsyncIterator<T>(iterator: AsyncIterableIterator<T>): Promise<T[]> {
  const result: T[] = []

  for await (const item of iterator) {
    result.push(item)
  }

  return result
}