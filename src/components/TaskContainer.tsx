import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"


interface Props {
    task: Task;
    deleteTask: (taskId: Id) => void;
    updateTask: (taskId: Id, value: string) => void;
}

export function TaskContainer(props: Props) {
    const { task, deleteTask, updateTask } = props
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false)
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
        useSortable({
            id: task.id,
            data: {
                type: 'Task',
                task
            },
            disabled: editMode
        });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    const toggleEditMode = () => {
        setEditMode(prev => !prev);
        setMouseIsOver(false);
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="
                bg-mainBackgroundColour
                p-2.5
                h-[100px] min-h-[100px]
                items-center
                flex 
                text-left 
                rounded-xl
                border-2 border-rose-500 cursor-grab
                relative
                opacity-30
                task"
            />
        )
    }

    if (editMode) {
        return (<div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="
            bg-mainBackgroundColour
            p-2.5
            h-[100px] min-h-[100px]
            items-center
            flex 
            text-left 
            rounded-xl
            hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab
            relative
            task"
        >
            <textarea
                className="
                h-[90%]
                w-full resize-none
                border-none
                rounded
                bg-transparent
                text-white
                focus:outline-none
                "
                value={task.content}
                autoFocus
                placeholder="Enter some content here ;)"
                onBlur={toggleEditMode}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && e.shiftKey) toggleEditMode();
                }}
                onChange={e => updateTask(task.id, e.target.value)}
            ></textarea>

        </div>);

    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={toggleEditMode}
            className="
            bg-mainBackgroundColour
            p-2.5
            h-[100px] min-h-[100px]
            items-center
            flex 
            text-left 
            rounded-xl
            hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab
            relative
            task"
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
        >
            <p
                className="my-auto h-[90%] w-full overflow-y-auto overflow-x-auto whitespace-pre-wrap"
            >{task.content}</p>
            {mouseIsOver
                && (<button
                    className="stroke-white bg-columnBackgroundColour absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded opacity-60 hover:opacity-100"
                    onClick={() => deleteTask(task.id)}
                >
                    <TrashIcon />
                </button>)}
        </div>
    )
}

// export function TaskContainer(props: Props) {
//     const { task } = props
//     return (
//         <div
//             className="
//             bg-mainBackgroundColour
//             h-[100px] min-h-[100px]
//             items-stretch flex text-left rounded-xl
//             hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab
//             flex-col p-2.5 relative top-1/2">
//             {/* Title */}
//             <div className="text-md rounded-md rounded-b-none font-bold flex items-center justify-between">
//                 <div>{`Title: ${task.title}`}</div>
//                 <button className="stroke-gray-500">
//                     <TrashIcon />
//                 </button>
//             </div>
//             {/* Content */}
//             <div>
//                 {task.content}
//             </div>
//         </div>
//     )
// }