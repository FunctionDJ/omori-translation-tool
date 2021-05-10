import { load } from "js-yaml"
import { useEffect, useState } from "preact/hooks"

export const fetchJson = (url: string) => (
  fetch(url).then(r => r.json())
)

export const fetchText = (url: string) => (
  fetch(url).then(r => r.text())
)

export const fetchYML = (name: string) => (
  fetchText(`www_decrypt/languages/en/${name}`)
    .then(load)
)

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value])

  return debouncedValue
}