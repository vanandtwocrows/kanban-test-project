import { useMemo, useState } from "react"
import { Column, Id, Task } from "../types"
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskContainer } from "./TaskContainer";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map(col => col.id), [columns]);

    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3, // 300px
        }
    }));

    const [activeTask, setActiveTask] = useState<Task | null>(null);

    console.log(columns);
    console.log(tasks);
    return (
        <div className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
        ">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer
                                    key={col.id}
                                    column={col}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    tasks={tasks.filter((task) => { return task.columnId === col.id })}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                />
                            ))}
                        </SortableContext>
                    </div>
                    <button
                        onClick={createNewColumn}
                        className='
                h-[60px]
                w-[350px]
                min-w-[450px]
                cursor-pointer
                rounded-lg
                bg-mainBackgroundColour
                border-2
                border-columnBackgroundColour
                p-4
                ring-rose-400
                hover:ring-2
                flex
                gap-2
                '
                    >
                        <PlusIcon />
                        Add column
                    </button>
                </div>
                {createPortal(<DragOverlay>
                    {activeColumn && (<ColumnContainer
                        column={activeColumn}
                        deleteColumn={deleteColumn}
                        updateColumn={updateColumn}
                        createTask={createTask}
                        tasks={tasks.filter((task) => { return task.columnId === activeColumn.id })}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                    />)}
                    {activeTask && (<TaskContainer
                        task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />)}
                </DragOverlay>, document.body)}
            </DndContext>
        </div>
    );

    function createNewColumn() {
        const nextColNum = columns.reduce((max, col) => {
            const numMatch = col.title.match(/\d+/);
            const num = numMatch ? parseInt(numMatch[0]) : 0; // Extract number from title if it exists
            return num > max ? num : max; // Compare and return the maximum
        }, 0) + 1;

        // console.log("Max col num?: ", nextColNum);
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${nextColNum}`,
        }
        setColumns([...columns, columnToAdd]);
    }

    function generateId() {
        return Math.floor(Math.random() * 10000);
    }

    function deleteColumn(id: Id) {
        const filterdColumns = columns.filter(col => col.id !== id);
        setColumns(filterdColumns);

        const filteredTasks = tasks.filter(task => task.columnId !== id);
        setTasks(filteredTasks);
    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map(col => {
            if (col.id !== id) return col;
            return { ...col, title }
        })
        setColumns(newColumns);
    }

    function createTask(columnId: Id) {
        const newTask = { id: generateId(), columnId, title: "New task", content: "Enter content here" }
        setTasks([...tasks, newTask])
    }

    function deleteTask(taskId: Id) {
        const filteredTasks = tasks.filter(task => task.id !== taskId)
        setTasks(filteredTasks)
    }

    function updateTask(taskId: Id, value: string) {
        const newTasks = tasks.map(task => {
            if (task.id !== taskId) return task;
            return { ...task, content: value };
        })
        setTasks(newTasks);
    }

    function onDragStart(event: DragStartEvent) {
        console.log("Drag start: ", event);
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        console.log("Drag end: ", event);

        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;

        if (!over) return;

        const activeColumnId = active.id
        const overColumnId = over.id

        if (activeColumnId === overColumnId) return;

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnId);
            const overColumnIndex = columns.findIndex((col) => col.id === overColumnId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    function onDragOver(event: DragOverEvent) {
        console.log("Drag over: ", event);
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task"
        if (!isActiveATask) return;

        const isOverATask = over.data.current?.type === "Task"
        const isOverAColumn = over.data.current?.type === "Column"

        // Dropping a task over a task
        if (isActiveATask && isOverATask) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(task => task.id === activeId)
                const overIndex = tasks.findIndex(task => task.id === overId)

                // if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                //     tasks[activeIndex].columnId = tasks[overIndex].columnId;
                // }
                tasks[activeIndex].columnId = tasks[overIndex].columnId;

                return arrayMove(tasks, activeIndex, overIndex)
            });
        }

        // Dropping a task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(task => task.id === activeId)

                tasks[activeIndex].columnId = overId;

                return arrayMove(tasks, activeIndex, activeIndex)
            });
        }

    }
}

export default KanbanBoard