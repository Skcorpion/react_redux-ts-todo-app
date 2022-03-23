import React from "react";
import CSSModules from "react-css-modules";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import styles from "./TodoList.module.scss";
import TodoListItem from "./TodoListItem";
import { allTodosCompleted, selectFilteredTodoIds } from "./todosSlice";

function TodoList() {
  const dispatch = useAppDispatch();
  const todoIds = useAppSelector(selectFilteredTodoIds);
  const toggleAll = useAppSelector((state) => state.todos.toggleAll);

  const onMarkCompletedClicked = () => dispatch(allTodosCompleted(!toggleAll));

  const renderListItems = todoIds.map((todoId) => (
    <TodoListItem key={todoId} id={todoId} />
  ));

  return (
    <section className="todo-list" styleName="section">
      <input
        className="todo-list__toggle-all"
        styleName="toggle"
        id="toggle-all"
        type="checkbox"
        checked={toggleAll}
        onChange={onMarkCompletedClicked}
      />
      <label htmlFor="toggle-all" />
      <ul className="todo-list__list" styleName="ul">
        {renderListItems}
      </ul>
    </section>
  );
}

export default CSSModules(TodoList, styles);
