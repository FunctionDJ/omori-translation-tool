import { StateUpdater, useEffect, useRef, useState } from "preact/hooks"
import { Dialog } from "./dialog"
import { useDropzone } from "react-dropzone"
import { DropzoneVisual } from "./dropzone-visual"
import { YmlData } from "../types"
import { dump, load } from "js-yaml"

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
      <div>
        <button onClick={download} disabled={!yml}>Download</button>
        <button onClick={clear}>Clear</button>
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
    <DropzoneVisual
      rootProps={getRootProps()}
      inputProps={getInputProps()}
      isDragActive={isDragActive}
    />
  )
}