import {
  DropzoneInputProps, DropzoneRootProps
} from "react-dropzone"

interface Props {
  rootProps: DropzoneRootProps
  inputProps: DropzoneInputProps
  isDragActive: boolean
}

export const DropzoneVisual = ({
  rootProps, inputProps, isDragActive
}: Props) => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
  }} {...rootProps}>
    <input {...inputProps}/>
    <p style={{
      cursor: "pointer",
      textAlign: "center"
    }}>
      {isDragActive ? (
        <strong>Drop it!</strong>
      ) : (
        <>
          Drag and Drop a YML file here
          <br/>
          or click me
        </>
      )}
    </p>
  </div>
)