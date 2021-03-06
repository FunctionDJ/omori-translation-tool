import { ActorsData, MessageData } from "../types"
import parseText from "../parse"
import { Face } from "./face"
import { Raw } from "./raw"
import { useContext, useEffect, useMemo, useState } from "preact/hooks"
import { Actors } from "./app"
import { useDebounce } from "../function"
import { Translation } from "./Translation"

interface Config {
  color: string
  shake: boolean
  font: string
  quake: number
}

const getActor = (actors: ActorsData|null, param: string) => {
  if (!actors) {
    return {
      id: 0,
      name: "Loading..."
    }
  }

  return actors?.find(a => a?.id === parseInt(param))
}

const routeOperator = (
  obj: any,
  i: number,
  config: Config,
  actors: ActorsData|null,
  getClasses: () => string
) => {
  switch (obj.operator) {
    case "c": {
      config.color = `c${obj.params}`
      break
    }
    case "n": {
      const actor = getActor(actors, obj.params)

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
    case "fn": {
      switch (obj.params) {
        case "OMORI_GAME2": {
          config.font = "OMORI_GAME2"
          break
        }
        case "OMORI_GAME": {
          config.font = "OMORI_GAME"
          break
        }
        default: console.log(obj)
      }
      break
    }
    case "quake": {
      config.quake = obj.params
      break
    }
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
  actors: ActorsData|null,
  getClasses: () => string
) => {
  switch (obj.type) {
    case "text": {
      if (config.shake) {
        return (
          <span key={i} className={getClasses()}>
            {obj.text.split("").map((letter: string, j: number) => (
              <span key={j} className={letter.trim() === "" ? "d-inline" : ""}>{letter}</span>
            ))}
          </span>
        )
      }

      const isQuake = config.quake !== 0

      return (
        <span key={i} className={getClasses()}>
          {isQuake ? (
            obj.text.split("").map((letter: string, j: number) => (
              <span key={j} className="shake-constant my-custom-shake">{letter}</span>
            ))
          ) : obj.text}
        </span>
      )
    }
    case "br": return <br key={i}/>
    case "numeric": {
      return routeOperator(obj, i, config, actors, getClasses)
    }
    case "string": {
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

interface Props {
  message: MessageData
  setMessage?: (text: string) => void
}

export const Message = ({ message, setMessage }: Props) => {
  const parsed = parseText(message.text || "") as any[]

  const actors = useContext(Actors)

  const config: Config = {
    color: "c0",
    shake: false,
    font: "OMORI_GAME2",
    quake: 0
  }

  const initText = useMemo(() => message.text, [])

  const [localText, setLocalText] = useState(initText)

  const debouncedText = useDebounce(localText, 50)

  useEffect(() => {
    if (!setMessage) {
      return
    }

    setMessage(debouncedText)
  }, [debouncedText])

  function getClasses() {
    return [
      config.color,
      config.shake ? "sinv" : "",
      config.font,
      "quake" + config.quake
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
          {!setMessage && <Translation/>}
          {parsed.map((obj, i) => routeObj(obj, i, config, actors, getClasses))}
        </div>
      </div>
      {setMessage ? (
        <textarea
          className="raw edit"
          value={localText}
          onChange={event => setLocalText(event.currentTarget.value)}
        />
      ) : (
        <Raw text={message.text}/>
      )}
    </div>
  )
}