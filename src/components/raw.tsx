interface Props {
  text: string
}

export const Raw = ({ text }: Props) => (
  <div className="raw message-element">
    {text}
  </div>
)