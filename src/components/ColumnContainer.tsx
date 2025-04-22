import { Column, Id, Task } from "../types";
import TrashIocn from "../icons/TrashIocn";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcons from "../icons/PlusIcons";
import TaskCard from "./TaskCard";
interface Props {
  column: Column;
  deletecolumn: (id: Id) => void;
  updateColumns: (id: Id, title: string) => void;
  createTask: (id: Id) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const ColumnContainer = (props: Props) => {
  const {
    column,
    deletecolumn,
    updateColumns,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;
  console.log("Tasks", tasks);
  const [isEditMode, setIsEditMode] = useState(false);
  const taskId = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: isEditMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
  bg-columnBackgroundColor
  w-[350px]
  h-[500px]
  rounded-md
  flex
  flex-col
  m-2
  "
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
  bg-columnBackgroundColor
  w-[350px]
  h-[500px]
  rounded-md
  flex
  flex-col
  m-2
  p-2
  "
    >
      {/* Column title */}
      <div
        onClick={() => setIsEditMode(!isEditMode)}
        {...attributes}
        {...listeners}
        className="
        bg-mainBackgroundColor
        text-md
        h-[60px]
        cursor-grab
        rounded-md
        p-3
        font-bold
        border-columnBackgroundColor
        border-4
        text-white
        flex
        aitem-center
        justify-between
         
        "
      >
        {!isEditMode && column.title}
        {isEditMode && (
          <input
            className="focus:border-rose-500"
            value={column.title}
            onChange={(e) => updateColumns(column.id, e.target.value)}
            autoFocus
            onBlur={() => {
              setIsEditMode(false);
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                setIsEditMode(false);
              }
            }}
          />
        )}
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            deletecolumn(column.id);
          }}
          className="cursor-pointer"
        >
          <TrashIocn />
        </button>
      </div>
      {/* Column content */}
      <div className="flex flex-grow flex-col gap-2 overflow-y-auto overflow-x-hidden flex-direction-column">
        <SortableContext items={taskId}>
          {tasks.map((task) => {
            return (
              <TaskCard
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            );
          })}
        </SortableContext>
      </div>
      {/* Column Footer */}
      <div
        className="
        flex
        gap-2
        items-center
        border-columnBackgroundColor
       hover:bg-mainBackgroundColor
        hover:text-rose-500
        active:bg-black
        text-md
        h-[60px]
        cursor-grab
        rounded-md
        p-3

        border-4
         text-white
        "
      >
        <button
          onClick={() => {
            createTask(column.id);
          }}
          className="flex justify-between align-middle cursor-pointer"
        >
          <PlusIcons />
          {"Column Footer"}
        </button>
      </div>
    </div>
  );
};

export default ColumnContainer;
