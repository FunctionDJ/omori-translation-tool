const fs = require("fs")
const path = require("path")

const ymlDirectory = path.join(process.cwd(), "public/www_decrypt/languages/en")
const files = fs.readdirSync(ymlDirectory)

const indexJSON = JSON.stringify(files, null, 2)
const filePath = path.join(process.cwd(), "public/yml-index.json")
fs.writeFileSync(filePath, indexJSON)