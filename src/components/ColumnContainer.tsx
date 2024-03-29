import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { TaskContainer } from "./TaskContainer";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (id: Id) => void;
  tasks: Task[];
  deleteTask: (taskId: Id) => void;
  updateTask: (taskId: Id, value: string) => void;
}

function ColumnContainer(props: Props) {
  const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask } = props
  
  const [editMode, setEditMode] = useState(false);
  
  const tasksIds = useMemo(() => {
    return tasks.map(task => task.id);
  }, [tasks]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: column.id,
      data: {
        type: 'Column',
        column
      },
      disabled: editMode
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
      {/* Column title */}
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
            {tasks.length}
          </div>
          {!editMode && column.title}
          {editMode
            && <input
              value={column.title}
              onChange={(e) => { updateColumn(column.id, e.target.value) }}
              autoFocus
              onBlur={() => { setEditMode(false); }}
              onKeyDown={(e) => {
                if (e.key != "Enter") return;
                setEditMode(false);
              }}
              className="
              bg-black
              focus:border-rose-500
              border
              rounded
              outline-none
              px-2
              "
            />}
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
      {/* Column body */}
      <div className="
      flex 
      flex-grow 
      flex-col
      gap-4
      p-2
      overflow-x-hidden
      overflow-y-auto
      ">
        <SortableContext items={tasksIds}>
          {tasks.map(task => (
          <TaskContainer 
            key={task.id} 
            task={task} 
            deleteTask={deleteTask} 
            updateTask={updateTask}
          />))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        onClick={() => {
          createTask(column.id);
        }}
        className="flex gap-2 items-center
      border-columnBackgroundColour 
      border-2 rounded-md 
      p-4 
      border-x-columnBackgroundColour 
      hover:bg-mainBackgroundColour 
      hover:text-rose-500 
      active:bg-black
      ">
        <PlusIcon />Add task
      </button>
    </div>
  );
}

export default ColumnContainer