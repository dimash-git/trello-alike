"use client";

import useBoardStore from "@/store/BoardStore";
import React, { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

const Board = () => {
  const [board, getBoard, setBoard, updateTodoInDB] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoard,
    state.updateTodoInDB,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    // check if dropped outside the board
    if (!destination) return;

    // Handle column drag
    if (type === "column") {
      const entries = [...board.columns.entries()];
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);

      const rearrangedColumns = new Map(entries);

      setBoard({
        ...board,
        columns: rearrangedColumns,
      });
      return;
    }

    const columns = [...board.columns];

    const startColIndex = columns[Number(source.droppableId)];
    const endColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0], // id
      todos: startColIndex[1].todos, // todos
    };

    const endCol: Column = {
      id: endColIndex[0],
      todos: endColIndex[1].todos,
    };

    if (!startCol || !endCol) return;

    // check if dropped in the same position
    if (source.index === destination.index && startCol === endCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1); // sec arg for hoq many to remove

    if (startCol.id === endCol.id) {
      // Same column taks drag
      newTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, {
        id: startCol.id,
        todos: newTodos,
      });

      setBoard({
        ...board,
        columns: newColumns,
      });
    } else {
      // Different column task drag
      const endTodos = endCol.todos;
      endTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);

      newColumns.set(startCol.id, {
        id: startCol.id,
        todos: newTodos,
      });
      newColumns.set(endCol.id, {
        id: endCol.id,
        todos: endTodos,
      });

      setBoard({
        ...board,
        columns: newColumns,
      });

      // Update todo in DB
      updateTodoInDB(todoMoved, endCol.id);
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {/* Columns */}
            {[...board.columns.entries()].map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
            {/* Add Column */}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
