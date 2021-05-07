import { useMemo, useState } from "preact/hooks"
import { load } from "js-yaml"
import { ActorsData, YmlData } from "../types"
import { Message } from "./message"

interface Props {
  text: string
  actors: ActorsData
  edit?: boolean
}

export const Dialog = ({ text, actors, edit }: Props) => {
  const ymlMemo = useMemo(() => load(text) as YmlData, [text])
  const [yml, setYml] = useState(ymlMemo)

  if (!yml) {
    console.log("erorr: yml", yml)
    return <p>Error...</p>
  }

  function handleChange(text: string, messageKey: string) {
    setYml(oldYml => {
      oldYml[messageKey].text = text
      return {...oldYml}
    })
  }

  return (
    <div className="dialog">
      {Object.entries(yml).map(([key, message]) => (
        <Message
          key={key} message={message}
          actors={actors}
          onChange={
            edit ? (
              (event: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => handleChange(event.currentTarget.value, key)
            ) : (
              undefined
            )
          }
        />
      ))}
    </div>
  )
}