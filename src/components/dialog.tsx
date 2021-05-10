import { StateUpdater } from "preact/hooks"
import { YmlData } from "../types"
import { Message } from "./message"

interface Props {
  yml: YmlData
  setYml?: StateUpdater<YmlData|null>
  edit?: boolean
}

export const Dialog = ({ yml, setYml, edit }: Props) => {
  function handleChange(text: string, messageKey: string) {
    if (!setYml) {
      return
    }

    setYml(oldYml => {
      if (!oldYml) {
        return {
          [messageKey]: { text }
        }
      }

      oldYml[messageKey].text = text

      return {...oldYml}
    })
  }

  return (
    <div className="dialog">
      {Object.entries(yml).map(([key, message]) => (
        <Message
          key={key} message={message}
          setMessage={
            edit ? (
              text => handleChange(text, key)
            ) : (
              undefined
            )
          }
        />
      ))}
    </div>
  )
}