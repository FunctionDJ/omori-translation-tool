import { useEffect, useState } from "preact/hooks"
import { Dialog } from "./dialog"
import { ActorsData } from "../types"
import { fetchJson, fetchYML } from "../function"
import useLocalStorage from "react-use-localstorage"

export function App() {
  const [current, setCurrent] = useLocalStorage("current", "01_cutscenes_neighbors.yml")
  
  const [dialog, setDialog] = useState("")

  const [index, setIndex] = useState<string[]>([])

  const [actors, setActors] = useState<ActorsData|null>(null)

  useEffect(() => {
    if (!current) {
      return
    }

    fetchYML(current).then(setDialog)
  }, [current])

  useEffect(() => {
    fetchJson("yml-index.json").then(setIndex)
    fetchJson("www_decrypt/data/Actors.json").then(setActors)
  }, [])

  return ( 
    <>
      <div id="viewer">
        <select
          value={current ?? ""}
          onChange={e => setCurrent(e.currentTarget.value)}
        >
          {index.map(file => (
            <option key={file} value={file}>
              {file.split("/").pop()?.split(".")[0]}
            </option>
          ))}
        </select>
        <br/>
        {Boolean(dialog) && actors && (
          <Dialog text={dialog} actors={actors}/>
        )}
      </div>
      <div id="editor">
        {Boolean(dialog) && actors && (
          <Dialog text={dialog} actors={actors} edit/>
        )}
      </div>
    </>
  )
}
