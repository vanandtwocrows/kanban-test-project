import { useMemo, useState } from "react"
import { Column, Id } from "../types"
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map(col => col.id), [columns]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3, // 300px
        }
    }));

    console.log(columns);
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
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer key={col.id} column={col} deleteColumn={deleteColumn} />
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
                    {activeColumn && (<ColumnContainer column={activeColumn} deleteColumn={deleteColumn} />)}
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
        const filterdColumns = columns.filter(col => col.id != id);
        setColumns(filterdColumns);
    }

    function onDragStart(event: DragStartEvent) {
        console.log("Drag start: ", event);
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        console.log("Drag end: ", event);
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
}

export default KanbanBoard