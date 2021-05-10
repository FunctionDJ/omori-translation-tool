import { useEffect, useMemo, useState } from "preact/hooks"
import { ActorsData, YmlData } from "../types"
import { fetchJson, useDebounce } from "../function"
import { Editor } from "./editor"
import { createContext } from "preact"
import { Viewer } from "./viewer"
import useLocalStorage from "react-use-localstorage"

export const Actors = createContext<ActorsData|null>(null)

export function App() {
  const [actors, setActors] = useState<ActorsData|null>(null)

  const [jsonStringInit, setJsonString] = useLocalStorage("wip")
  const jsonString = useMemo(() => jsonStringInit, [])
  const [editorYml, setEditorYml] = useState<YmlData|null>(null)
  const debouncedEditorYml = useDebounce(editorYml, 2000)

  useEffect(() => {
    try {
      setEditorYml(JSON.parse(jsonString))
    } catch {
      setEditorYml(null)
    }
  }, [jsonString])

  useEffect(() => {
    setJsonString(JSON.stringify(debouncedEditorYml))
  }, [debouncedEditorYml])

  useEffect(() => {
    fetchJson("www_decrypt/data/Actors.json").then(setActors)
  }, [])

  function clone(yml: YmlData) {
    const ymlJsonString = JSON.stringify(yml)
    setJsonString(ymlJsonString)
    setEditorYml(JSON.parse(ymlJsonString))
  }

  return (
    <Actors.Provider value={actors}>
      <div id="viewer">
        <Viewer clone={clone}/>
      </div>
      <div id="editor">
        <Editor yml={editorYml} setYml={setEditorYml}/>
      </div>
    </Actors.Provider>
  )
}
