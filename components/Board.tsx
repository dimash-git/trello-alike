"use client";

import useBoardStore from "@/store/BoardStore";
import React, { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const Board = () => {
  const getBoard = useBoardStore((state) => state.getBoard);

  useEffect(() => {
    getBoard();
  }, [getBoard]);
  return (
    <h1>Hello</h1>
    // <DragDropContext>
    //   <Droppable droppableId="board" direction="horizontal" type="column">
    //     {(provided) => (
    //       <div
    //         className="board"
    //         {...provided.droppableProps}
    //         ref={provided.innerRef}
    //       >
    //         {/* Columns */}
    //         {/* Add Column */}
    //         {provided.placeholder}
    //       </div>
    //     )}
    // </DragDropContext>
  );
};

export default Board;
