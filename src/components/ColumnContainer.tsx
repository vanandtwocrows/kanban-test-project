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
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    "
    >
      {/* Task title */}
      <div className="
      bg-mainBackgroundColour
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-3
      font-bold
      border-columnBackgroundColour
      border-4
      ">
        {column.title}
      </div>
      {/* Task body */}
      <div className="flex flex-grow">
        Content
      </div>
      {/* Task footer */}
      <div>
        footer
      </div>
    </div>
  )
}

export default ColumnContainer