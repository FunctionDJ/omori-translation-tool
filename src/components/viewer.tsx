import { useEffect, useState } from "preact/hooks"
import useLocalStorage from "react-use-localstorage"
import { fetchJson, fetchYML } from "../function"
import { YmlData } from "../types"
import { Dialog } from "./dialog"

interface Props {
  clone: (yml: YmlData) => void
}

export const Viewer = ({ clone }: Props) => {
  const [current, setCurrent] = useLocalStorage("current", "01_cutscenes_neighbors.yml")
  const [index, setIndex] = useState<string[]>([])

  const [yml, setYml] = useState<YmlData|null>(null)

  useEffect(() => {
    fetchJson("yml-index.json").then(setIndex)
  }, [])

  useEffect(() => {
    if (!current) {
      return
    }

    fetchYML(current).then(yml => {
      setYml(yml as YmlData)
    })
  }, [current])

  return (
    <>
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
      {yml && (
        <>
          <button onClick={() => clone(yml)}>Clone to editor (overwrites!)</button>
          <Dialog yml={yml}/>
        </>
      )}
    </>
  )
}