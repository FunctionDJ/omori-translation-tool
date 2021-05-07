import { ActorsData, MessageData } from "../types"
import parseText from "../parse"
import { Face } from "./face"
import { Raw } from "./raw"

interface Props {
  message: MessageData
  actors: ActorsData
  onChange: (
    (event: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => void
  ) | undefined
}

interface Config {
  color: string
  shake: boolean
}

const routeOperator = (
  obj: any,
  i: number,
  config: Config,
  actors: ActorsData,
  getClasses: () => string
) => {
  switch (obj.operator) {
    case "c": {
      config.color = `c${obj.params}`
      break
    }
    case "n": {
      const actor = actors.find(a => a?.id === parseInt(obj.params))

      return (
        <span
          key={i}
          className={getClasses()}
        >
          {actor?.name ?? "[UNKNOWN]"}
        </span>
      )
    }
    case "com": return // ignore
    case "sinv": {
      config.shake = obj.params !== "0"
      break
    }
    default: console.log(obj)
  }
}

const routeObj = (
  obj: any,
  i: number,
  config: Config,
  actors: ActorsData,
  getClasses: () => string
) => {
  switch (obj.type) {
    case "text": return (
      <span key={i} className={getClasses()}>
        {obj.text}
      </span>
    )
    case "br": return <br key={i}/>
    case "numeric": {
      return routeOperator(obj, i, config, actors, getClasses)
    }
    case "literal": return (
      <span
        key={i}
        className={getClasses() + " literal"}
      >
        {obj.text}
      </span>
    )
    default: {
      console.log(obj)

      return (
        <span key={i} className={getClasses()}>
          {obj.text}
        </span>
      )
    }
  }
}

export const Message = ({ message, actors, onChange }: Props) => {
  const parsed = parseText(message.text || "") as any[]

  const config: Config = {
    color: "c0",
    shake: false
  }

  function getClasses() {
    return [
      config.color,
      config.shake ? "sinv" : "",
      "fOMORI_GAME"
    ].join(" ")
  }

  return (
    <div className="message">
      <div className="face-text-container">
        {"faceindex" in message && (
          <Face
            faceindex={message.faceindex}
            faceset={message.faceset}
          />
        )}
        <div className="text message-element">
          {parsed.map((obj, i) => routeObj(obj, i, config, actors, getClasses))}
        </div>
      </div>
      {onChange ? (
        <textarea
          className="raw raw-edit"
          value={message.text}
          onChange={event => onChange(event)}
        />
      ) : (
        <Raw>{message.text}</Raw>
      )}
    </div>
  )
}