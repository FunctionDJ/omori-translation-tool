export const fetchJson = (url: string) => (
  fetch(url).then(r => r.json())
)

export const fetchText = (url: string) => (
  fetch(url).then(r => r.text())
)

export const fetchYML = (name: string) => (
  fetchText(`www_decrypt/languages/en/${name}`)
)