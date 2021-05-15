import { render } from "preact"
import { App } from "./components/app"

import "bootstrap/dist/css/bootstrap.min.css"
import "bootswatch/dist/darkly/bootstrap.min.css"
import "./css/index.css"
import "./css/text.scss"
import "./css/elements.scss"
import "firacode/distr/fira_code.css"
import "@fortawesome/fontawesome-free/css/all.css"

render(<App />, document.getElementById("app")!)
