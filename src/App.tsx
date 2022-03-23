import React, { useEffect } from "react";
import "./App.scss";
import Footer from "./features/footer/Footer";
import Header from "./features/header/Header";
import TodoList from "./features/todos/TodoList";
import storeJS from "store";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectTodos, todosReceived } from "./features/todos/todosSlice";
import { nanoid } from "@reduxjs/toolkit";

function createInitialInstructions(arrOfInstructions: Array<string>) {
  return arrOfInstructions.map((instruction) => {
    return {
      completed: false,
      date: new Date().toISOString(),
      edited: false,
      id: nanoid(),
      text: instruction,
    };
  });
}

const instructions = [
  "Завдання можна редагувати",
  "Є функція вибору всіх завдань",
  "Дані зберігаються в локальному сховищі",
  "Все інше очевидно",
];

function App() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => selectTodos(state));

  const saveStore = () => {
    storeJS.set("todos", todos);
  };

  // first mount(with reload) & unmount
  useEffect(() => {
    const storedTodos = storeJS.get("todos");
    if (storedTodos) {
      dispatch(todosReceived(storedTodos));
    } else {
      // On first load show instruction
      const initialTodos = createInitialInstructions(instructions);
      dispatch(todosReceived(initialTodos));
    }
    return () => {
      saveStore();
    };
  }, []);

  /* update function in addEventListener when todos changes 
    (Every render you get a new copy of saveStore function. 
    Each copy captures the current value of todos. 
    Your listener has a copy which was created on the first render with todos = [])
    https://stackoverflow.com/questions/55326406/react-hooks-value-is-not-accessible-in-event-listener-function
    */
  useEffect(() => {
    window.addEventListener("beforeunload", saveStore);
    return () => {
      window.removeEventListener("beforeunload", saveStore);
    };
  }, [todos]);

  return (
    <section className="app">
      <Header />
      <TodoList />
      <Footer />
    </section>
  );
}

export default App;
