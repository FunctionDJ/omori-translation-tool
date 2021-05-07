interface Props {
  faceindex: number
  faceset: string
}

export const Face = ({ faceset, faceindex }: Props) => {
  const row = Math.floor(faceindex / 4)
  const column = faceindex % 4

  return (
    <div
      className="face message-element"
      style={{
        backgroundImage: `url(www_decrypt/img/faces/${faceset}.png)`,
        backgroundPosition: `left ${column * -106}px top ${row * -106}px`,
      }}
    />
  )
}