import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { Id, Task } from "../types";
import TrashIocn from "../icons/TrashIocn";
import { useSortable } from "@dnd-kit/sortable";
interface TaskProps {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const TaskCard = ({ task, deleteTask, updateTask }: TaskProps) => {
  //   const [isMoueOver, setIsMouseOver] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    // setIsEditMode(!isMoueOver);
  };
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
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
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor  rounded-xl border-rose-500 border-1 p-2.5 h-[100px] min-h-[100px] items-center opacity-50"
      />
    );
  }
  if (isEditMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left
       rounded-xl
       hover:ring-2
       hover:ring-inset
       hover:ring-rose-500
       cursor-grab
       relative
      "
      >
        <textarea
          className="
            h-[90%
            w-full resize-none border-none rounded bg-transparent text-white focus:outline-none
            "
          value={task.content}
          autoFocus
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
      </div>
    );
  }
  return (
    <div
      onClick={toggleEditMode}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-mainBackgroundColor p-2.5 h-[100px]  min-h-[100px] items-center flex text-left
     rounded-xl
     hover:ring-2
     hover:ring-inset
     hover:ring-rose-500
     cursor-grab
     relative
    "
      //   onMouseEnter={() => {
      //     setIsMouseOver(true);
      //   }}
      //   onMouseOut={() => {
      //     setIsMouseOver(false);
      //   }}
    >
      {task.content}
      {/* {!isMoueOver && ( */}
      <button
        className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100 z-auto "
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.stopPropagation();
          deleteTask(task.id);
        }}
      >
        <TrashIocn />
      </button>
      {/* )} */}
    </div>
  );
};

export default TaskCard;
