import {
  DropzoneInputProps, DropzoneRootProps
} from "react-dropzone"

interface Props {
  rootProps: DropzoneRootProps
  inputProps: DropzoneInputProps
  isDragActive: boolean
}

export const MyDropzone = ({
  rootProps, inputProps, isDragActive
}: Props) => (
  <div
    className={`
      d-flex pointer justify-content-center
      align-items-center h-100 dropzone
      ${isDragActive ? "drag" : ""}
    `}
    {...rootProps}
  >
    <input {...inputProps}/>
    <p
      href="#"
      className="text-center text-light fs-4 fw-bold"
    >
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