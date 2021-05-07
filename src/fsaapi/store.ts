import { set } from "idb-keyval"
import { getArrayFromAsyncIterator } from "./functions"

const getPathParts = (path: string): [string[], string] => {
  const pathBits = path.split("/")

  const [fileName] = pathBits.slice(-1)
  const directoryBits = pathBits.slice(0, -1)

  return [directoryBits, fileName]
}

const getTargetFolderHandle = async (
  rootHandle: FileSystemDirectoryHandle,
  directoryBits: string[]
) => {
  let folder = rootHandle

  for (const bit of directoryBits) {
    folder = await folder.getDirectoryHandle(bit)
  }

  return folder
}

export const storeFile = async (
  rootHandle: FileSystemDirectoryHandle,
  path: string
) => {
  const [directoryBits, fileName] = getPathParts(path)

  const folder = await getTargetFolderHandle(rootHandle, directoryBits)

  const fileHandle = await folder.getFileHandle(fileName)
  const file = await fileHandle.getFile()

  await set(path, file)

  return fileHandle
}

export const storeDirectory = async (
  rootHandle: FileSystemDirectoryHandle,
  path: string,
  extension: string
) => {
  const directoryBits = path.split("/")
  
  const folder = await getTargetFolderHandle(rootHandle, directoryBits)

  const fileHandles = await getArrayFromAsyncIterator(folder.values())

  const filteredFiles = fileHandles.filter(
    (f): f is FileSystemFileHandle => f.name.endsWith("." + extension)
  )

  await Promise.all(filteredFiles.map(async f => {
    const file = await f.getFile()
    const fullFilePath = [path, f.name].join("/")
    return set(fullFilePath, file)
  }))

  return filteredFiles
}