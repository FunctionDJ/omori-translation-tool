export interface SimpleMessageData {
  text: string
}

export interface FaceMessageData extends SimpleMessageData {
  faceset: string
  faceindex: number
}

export type MessageData = SimpleMessageData | FaceMessageData

export interface YmlData {
  [key: string]: MessageData
}

export type ActorsData = ({
  id: number
  name: string
}|null)[]