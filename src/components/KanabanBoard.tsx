import { useEffect, useMemo, useState } from "react";
import PlusIcons from "../icons/PlusIcons";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const KanabanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(() => {
    const saved = localStorage.getItem("columns");
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  //const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  //const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  // Update localStorage whenever columns change
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  // Update localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );
  console.log("tasks-updated", tasks);
  return (
    <div
      className="
  m-auto
  flex
  min-h-screen
  w-full
  item-center
  overflow-y-hidden
   bg-mainBackgroundColor
  overflow-x-auto
  ps-[40px]
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={ondragover}
      >
        <div className="m-auto flex">
          <SortableContext items={columnsId}>
            {columns.map((column, index) => {
              return (
                <ColumnContainer
                  column={column}
                  key={index}
                  deletecolumn={deletecolumn}
                  updateColumns={updateColumns}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId == column.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              );
            })}
          </SortableContext>
          <button
            onClick={createNewColumn}
            className="
              h-[60px]
              w-[350px]
              cursor-pointer
              rounded-lg
              bg-mainBackgroundColor
              border-columnBackgroundColor
              p-4
              ring-rose-500
              hover:ring-2
              flex
              gap-2
              text-white

              "
          >
            <PlusIcons />
            KanabanBoard
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deletecolumn={deletecolumn}
                updateColumns={updateColumns}
                createTask={createTask}
                tasks={tasks.filter((task) => task.columnId == activeColumn.id)}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createNewColumn() {
    const columnToAdd: Column = {
      id: genrateId(),
      title: `Columns ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }
  function genrateId() {
    return Math.floor(Math.random() * 10001);
  }
  function deletecolumn(id: Id) {
    const fiterColumns = columns.filter((item) => item.id !== id);
    setColumns(fiterColumns);
  }
  function updateColumns(id: Id, title: string) {
    const newColumns = columns.map((item) => {
      if (item.id !== id) return item;

      return { ...item, title };
    });
    setColumns(newColumns);
  }
  function createTask(columnId: Id) {
    const newTask: Task = {
      id: genrateId(),
      columnId,
      content: `Task ${tasks.length + 1} `,
    };
    console.log("create task-newTask", columnId, newTask);
    setTasks([...tasks, newTask]);
  }
  function deleteTask(id: Id) {
    const fiterTasks = tasks.filter((task) => task.id !== id);
    setTasks(fiterTasks);
  }
  function updateTask(id: Id, content: string) {
    const updatedTask = tasks.map((task) => {
      if (task.id !== id) return task;

      return { ...task, content };
    });
    setTasks(updatedTask);
  }
  function onDragStart(event: DragStartEvent) {
    console.log("event", event);
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
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId == overId) return;
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }
  function ondragover(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId == overId) return;
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    if (!isActiveATask) return;
    // dropping a task over another task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
        const overTaskIndex = tasks.findIndex((task) => task.id === overId);
        // if (tasks[activeTaskIndex].columnId !== tasks[overTaskIndex].columnId) {
        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
        // }
        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }

    // dropping a task over another column
    const isOverAcolumn = over.data.current?.type === "Column";
    if (isActiveATask && isOverAcolumn) {
      setTasks((tasks) => {
        console.log("tasks---------", tasks, activeId);
        const activeIndex = tasks.findIndex(
          (task) => task.columnId === activeId
        );

        // }
        // eslint-disable-next-line no-debugger
        // debugger;

        if (tasks[activeIndex]) {
          tasks[activeIndex].columnId = overId;
        }

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
};

export default KanabanBoard;
