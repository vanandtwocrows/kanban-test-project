import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import TrashIcon from "../icons/TrashIcon";
import { Column, Id } from "../types";
import { useState } from "react";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
}

function ColumnContainer(props: Props) {
  const { column, deleteColumn } = props
  const [editMode, setEditMode] = useState(false);
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: column.id,
      data: {
        type: 'Column',
        column
      }
    });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  if (isDragging) {
    return (<div
      ref={setNodeRef}
      style={style}
      className="
        bg-columnBackgroundColour
        text-white
        opacity-40
        border-2
        border-rose-500
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        flex
        flex-col
        ">
    </div>)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
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
      <div
        {...attributes}
        {...listeners}
        onClick={() => { setEditMode(true); }}
        className="
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
      flex
      items-center
      justify-between
      ">
        <div className="
        flex
        gap-2
        ">
          <div className="
          flex
          justify-center
          items-center
          bg-columnBackgroundColour
          px-2
          py-1
          text-sm
          rounded-full
          ">
            0
          </div>
          {!editMode && column.title}
          {editMode && <input autoFocus onBlur={() => { setEditMode(false); }} />}
        </div>
        <button
          onClick={() => { deleteColumn(column.id) }}
          className="
        stroke-gray-500
        hover:stroke-white
        hover:bg-columnBackgroundColour
        px-1
        py-2
        ">
          <TrashIcon />
        </button>
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