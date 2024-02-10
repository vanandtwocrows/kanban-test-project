import { useState } from "react"
import { Column, Id } from "../types"
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([])
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
            <div className="m-auto flex gap-4">
                <div className="flex gap-4">
                    {columns.map((col) => (
                        <ColumnContainer column={col} deleteColumn={deleteColumn} key={col.id}/>
                    ))}
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
        </div>
    );

    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
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
}

export default KanbanBoard