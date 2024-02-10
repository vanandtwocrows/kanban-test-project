import { Task } from "../types";


interface Props {
    task: Task;
}

export function TaskContainer(props: Props) {
    const { task } = props
    return (
        <div className="
        text-white
        bg-mainBackgroundColour
        flex
        flex-col
        m-4
        p-4">
            {/* Title */}
            <div className="
            border-2
            border-black
            ">
                {task.title}
            </div>
            {/* Content */}
            <div>
                {task.content}
            </div>
            {/* footer */}
            <div>footer</div>
        </div>
    )
}