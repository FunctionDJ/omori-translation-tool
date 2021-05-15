import { useContext, useRef, useState } from "preact/hooks"
import Overlay from "react-bootstrap/Overlay"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import CopyToClipboard from "react-copy-to-clipboard"
import { FA } from "./fontawesome"
import { LanguageContext } from "./viewer"

export const Translation = () => {
  const target = useRef(null)
  const [translationText, setTranslationText] = useState<string|null>(null)
  const language = useContext(LanguageContext)

  function handleTranslate(event: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    const parent = event.currentTarget.parentElement

    if (!parent) {
      return
    }

    const text = parent.innerText

    fetch(".netlify/functions/translate", {
      method: "POST",
      body: JSON.stringify({
        text,
        target_lang: language
      })
    })
      .then(r => r.json())
      .then(data => {
        setTranslationText(data.translations[0].text)
      })
  }

  return (
    <>
      <button
        ref={target}
        title="translate"
        className="btn btn-small btn-primary mr-2 p-1"
        style={{ lineHeight: ".1em" }}
        onClick={handleTranslate}
        disabled={translationText !== null}
      >
        <FA i="language"/>
      </button>
      <Overlay target={target.current} show={translationText !== null} placement="bottom" onExit={console.log}>
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <Modal.Dialog {...props}>
            <Modal.Header closeButton onHide={() => setTranslationText(null)}>Translation to {language}</Modal.Header>
            <Modal.Body>{translationText}</Modal.Body>
            <Modal.Footer>
              <CopyToClipboard text={translationText ?? ""}>
                <Button>Copy to clipboard</Button>
              </CopyToClipboard>
            </Modal.Footer>
          </Modal.Dialog>
        )}
      </Overlay>
    </>
  )
}