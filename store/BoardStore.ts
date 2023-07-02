import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/utils/getTodosGroupedByColumn";
import uploadImage from "@/utils/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: Board;
  newTaskInput: string;
  newTaskType: TypedColumn;
  searchTerm: string;
  image: File | null;

  getBoard: () => void;
  setBoard: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  deleteTask: (taskIdx: number, todo: Todo, columnId: TypedColumn) => void;

  setNewTaskInput: (newTaskInput: string) => void;
  setNewTaskType: (newTaskType: TypedColumn) => void;
  setImage: (image: File | null) => void;
  addTask: (
    todoTitle: string,
    columnId: TypedColumn,
    image?: File | null
  ) => void;

  setSearchTerm: (searchString: string) => void;
}

const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  newTaskInput: "",
  newTaskType: "todo",
  image: null,

  searchTerm: "",

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoard: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  deleteTask: async (taskIdx, todo, columnId) => {
    const newColumns = new Map(get().board.columns);

    newColumns.get(columnId)?.todos.splice(taskIdx, 1);

    set({
      board: {
        columns: newColumns,
      },
    });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  setNewTaskInput: (newTaskInput) => set({ newTaskInput }),
  setNewTaskType: (newTaskType) => set({ newTaskType }),
  setImage: (image) => set({ image }),

  addTask: async (todoTitle, columnId, image?) => {
    let fileObj: Image | undefined;

    if (image) {
      const uploaded = await uploadImage(image);
      if (uploaded) {
        fileObj = {
          bucketId: uploaded.bucketId,
          fileId: uploaded.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todoTitle,
        status: columnId,
        ...(fileObj && { image: JSON.stringify(fileObj) }),
      }
    );

    set({ newTaskInput: "" });
    // reset task input

    set((state) => {
      const newColumns = new Map(state.board.columns);
      const column = newColumns.get(columnId);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todoTitle,
        status: columnId,
        ...(fileObj && { image: fileObj }),
      };

      if (column) {
        newColumns.get(columnId)?.todos.push(newTodo);
      } else {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },

  setSearchTerm: (searchTerm) => set({ searchTerm }),
}));

export default useBoardStore;
