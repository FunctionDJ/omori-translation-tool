const { promises, readFileSync } = require("fs")
const { readdir } = promises
const path = require("path")

const searchIgnoreExtensions = ["ogg", "webm", "png", "dll", "ttf", "zip"]

const isFile = d => d.isFile()
const isDirectory = d => d.isDirectory()
const direntToName = d => d.name

const filterFileName = (filename) => {
  for (const ext of searchIgnoreExtensions) {
    if (filename.endsWith("." + ext)) {
      return false
    }
  }

  return true
}

const addDirectory = directoryName => fileName => path.join(directoryName, fileName)

const getSearchableFilesAndDirectories = async directory => {
  const children = await readdir(directory, { withFileTypes: true })
  
  const files = children
    .filter(isFile)
    .map(direntToName)
    .filter(filterFileName)
    .map(addDirectory(directory))
    
  const directories = children
    .filter(isDirectory)
    .map(direntToName)
    .map(addDirectory(directory))

  return [files, directories]
}

async function findFileEverywhere(directory, filenameNoExt) {
  const [files, directories] = await getSearchableFilesAndDirectories(directory)

  const found = files.find(f => {
    const contents = readFileSync(f, "utf-8")
    const searchResult = contents.toLowerCase().indexOf(filenameNoExt)
    return searchResult !== -1
  })

  if (found) {
    return true
  }

  for (const d of directories) {
    if (await findFileEverywhere(d, filenameNoExt)) {
      return true
    }
  }

  return false
}

(async () => {
  console.log("this might take a minute...")
  const langFiles = await readdir("languages/en", { withFileTypes: true })

  const unusedPromises = langFiles.map(dirent => {
    const filenameNoExt = path.parse(dirent.name).name.toLowerCase()

    return findFileEverywhere("./", filenameNoExt).then(r => ({ filename: filenameNoExt, notFoundAnywhere: !r }))
  })

  const results = await Promise.all(unusedPromises)

  console.log(
    results
      .filter(r => r.notFoundAnywhere)
      .map(r => r.filename)
  )
})()