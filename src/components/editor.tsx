import { StateUpdater, useEffect, useRef, useState } from "preact/hooks"
import { Dialog } from "./dialog"
import { useDropzone } from "react-dropzone"
import { MyDropzone } from "./dropzone-visual"
import { YmlData } from "../types"
import { dump, load } from "js-yaml"
import { FA } from "./fontawesome"

interface Props {
  yml: YmlData|null
  setYml: StateUpdater<YmlData|null>
}

export const Editor = ({ yml, setYml }: Props) => {
  const downloadRef = useRef<HTMLAnchorElement>(null)
  const [downloadURL, setDownloadURL] = useState<string|null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: ".yml",
    onDrop(files: File[]) {
      files[0].text().then(ymlString => {
        setYml(load(ymlString) as YmlData)
      })
    }
  })

  useEffect(() => {
    if (downloadURL) {
      downloadRef.current?.click()
    }
  }, [downloadURL])

  function download() {
    if (downloadURL) {
      // keep memory clean
      URL.revokeObjectURL(downloadURL)
    }

    if (!yml) {
      return
    }

    const ymlString = dump(yml)

    const blob = new Blob([ymlString])
    setDownloadURL(URL.createObjectURL(blob))
  }

  function clear() {
    setYml(null)
  }

  return yml ? (
    <>
      <div className="mb-3 w-100">
        <button
          className="btn btn-primary"
          onClick={download}
          disabled={!yml}
        >
          <FA i="download"/> Download YML
        </button>
        <button
          className="btn btn-danger float-right"
          onClick={clear}
        >
          <FA i="trash"/> Clear
        </button>
        {downloadURL && (
          <a
            ref={downloadRef}
            style={{ display: "none" }}
            href={downloadURL}
            download="filename.yml"
          />
        )}
      </div>
      <Dialog yml={yml} setYml={setYml} edit/>
    </>
  ) : (
    <MyDropzone
      rootProps={getRootProps()}
      inputProps={getInputProps()}
      isDragActive={isDragActive}
    />
  )
}