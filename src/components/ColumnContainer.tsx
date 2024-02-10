import { Column } from "../types";

interface Props {
    column: Column;
}

function ColumnContainer(props: Props) {
    const { column } = props
  return (
    <div className="
    bg-columnBackgroundColour
    text-white
    "
    >{column.title}</div>
  )
}

export default ColumnContainer