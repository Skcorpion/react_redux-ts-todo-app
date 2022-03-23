import {
  createSlice,
  createEntityAdapter,
  nanoid,
  PayloadAction,
  createSelector,
  EntityState,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { StatusFilters } from "../filters/filtersSlice";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  edited: boolean;
};

type InitialState = EntityState<Todo> & {
  toggleAll: boolean;
  todoEditedId: null | string;
};

const todosAdapter = createEntityAdapter<Todo>();
const initialState: InitialState = todosAdapter.getInitialState({
  toggleAll: false,
  todoEditedId: null,
});

// some thunk

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    todosReceived(state, action: PayloadAction<Todo[]>) {
      todosAdapter.setAll(state, action.payload);
    },
    todoAdded: {
      reducer(state, action: PayloadAction<Todo>) {
        todosAdapter.addOne(state, action.payload);
      },
      prepare(text: string) {
        return {
          payload: {
            id: nanoid(),
            text,
            completed: false,
            date: new Date().toISOString(),
            edited: false,
          },
        };
      },
    },
    todoEdited: {
      reducer(
        state,
        action: PayloadAction<{ id: string; text: string; date: string }>
      ) {
        const { id: todoId, text, date } = action.payload;
        const todo = state.entities[todoId];
        if (todo!.text !== text) {
          todo!.text = text;
          todo!.edited = true;
          todo!.date = date;
        }
      },
      prepare(id: string, text: string) {
        return {
          payload: {
            id,
            text,
            date: new Date().toISOString(),
          },
        };
      },
    },
    // todoEdited: todosAdapter.updateOne,
    todoToggled(state, action: PayloadAction<string>) {
      const todoId = action.payload;
      const todo = state.entities[todoId];
      todo!.completed = !todo!.completed;
    },
    allToggled(state, action: PayloadAction<boolean>) {
      state.toggleAll = action.payload;
    },
    todoDeleted: todosAdapter.removeOne,
    allTodosCompleted(state, action: PayloadAction<boolean>) {
      if (action.payload) {
        Object.values(state.entities).forEach((todo) => {
          todo!.completed = true;
        });
      } else {
        Object.values(state.entities).forEach((todo) => {
          todo!.completed = false;
        });
      }
    },
    setTodoEditingId(state, action: PayloadAction<null | string>) {
      state.todoEditedId = action.payload;
    },
    completedTodosCleared(state) {
      const completedIds = Object.values(state.entities)
        .filter((todo) => todo!.completed)
        .map((todo) => todo!.id);
      todosAdapter.removeMany(state, completedIds);
    },
  },
});

export const {
  todosReceived,
  todoAdded,
  todoToggled,
  todoDeleted,
  allTodosCompleted,
  allToggled,
  completedTodosCleared,
  todoEdited,
  setTodoEditingId,
} = todosSlice.actions;

export default todosSlice.reducer;

// selectors
export const { selectAll: selectTodos, selectById: selectTodoById } =
  todosAdapter.getSelectors((state: RootState) => state.todos);

export const selectFilteredTodos = createSelector(
  selectTodos,
  (state: RootState) => state.filters,
  (todos, filters) => {
    const { status } = filters;
    if (status === StatusFilters.All) {
      return todos;
    }

    const completedStatus = status === StatusFilters.Completed;
    return todos.filter((todo) => todo.completed === completedStatus);
  }
);

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodos,
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
);
