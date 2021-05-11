import { render } from "preact"
import { App } from "./components/app"
import "./css/index.css"
import "./css/text.scss"

render(<App />, document.getElementById("app")!)
