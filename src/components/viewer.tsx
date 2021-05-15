import { createContext } from "preact"
import Form from "react-bootstrap/Form"
import { useEffect, useState } from "preact/hooks"
import useLocalStorage from "react-use-localstorage"
import { deeplLanguages } from "../deepl-languages"
import { fetchJson, fetchYML } from "../function"
import { YmlData } from "../types"
import { Dialog } from "./dialog"
import { FA } from "./fontawesome"

interface Props {
  clone: (yml: YmlData) => void
}

export const LanguageContext = createContext("DE")

export const Viewer = ({ clone }: Props) => {
  const [current, setCurrent] = useLocalStorage("current", "01_cutscenes_neighbors.yml")
  const [index, setIndex] = useState<string[]>([])

  const [yml, setYml] = useState<YmlData|null>(null)
  
  const [language, setLanguage] = useState("DE")

  useEffect(() => {
    fetchJson("yml-index.json").then(setIndex)
  }, [])

  useEffect(() => {
    if (!current) {
      return
    }

    fetchYML(current).then(yml => {
      setYml(yml as YmlData)
      // setYml({
      //   "Msg_01": {
      //     text: "hi"
      //   }
      // })
    })
  }, [current])

  return (
    <>
      <div className="d-flex mb-3">
        <Form.Control
          as="select"
          className="w-50"
          value={current ?? ""}
          onChange={e => setCurrent(e.currentTarget.value)}
        >
          {index.map(file => (
            <option key={file} value={file}>
              {file.split("/").pop()?.split(".")[0]}
            </option>
          ))}
        </Form.Control>
        {yml && (
          <button
            className="btn btn-primary ml-3 flex-grow-1"
            onClick={() => clone(yml)}
          >
            <FA i="copy"/> Clone to editor (overwrites!)
          </button>
        )}
        <Form.Control
          title="Translation target language"
          as="select"
          className="w-25 ml-3"
          value={language}
          onChange={e => setLanguage(e.currentTarget.value)}
        >
          {Object.entries(deeplLanguages).map(([code, name]) => (
            <option key={code} value={code}>{code}: {name}</option>
          ))}
        </Form.Control>
      </div>
      {yml && (
        <LanguageContext.Provider value={language}>
          <Dialog yml={yml}/>
        </LanguageContext.Provider>
      )}
    </>
  )
}