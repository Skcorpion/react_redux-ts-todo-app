import React, { useEffect } from "react";
import CSSModules from "react-css-modules";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { statusFilterChange, StatusFilters } from "../filters/filtersSlice";
import {
  allToggled,
  completedTodosCleared,
  selectTodos,
} from "../todos/todosSlice";
import classNames from "classnames";
import styles from "./Footer.module.scss";

function Footer() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => selectTodos(state));

  const todosRemaining = todos.filter((todo) => !todo.completed).length;

  /**
   * all toggle logic
   * inside useEffecet because of warning
   * https://stackoverflow.com/questions/62336340/cannot-update-a-component-while-rendering-a-different-component-warning
   */
  useEffect(() => {
    if (todos.length > 0 && todosRemaining === 0) {
      dispatch(allToggled(true));
    } else {
      dispatch(allToggled(false));
    }
  });

  const suffix = todosRemaining === 1 ? "" : "s";

  const { status } = useAppSelector((state) => state.filters);
  const onStatusChange = (status: string) =>
    dispatch(statusFilterChange(status));

  const onClearCompletedClicked = () => dispatch(completedTodosCleared());

  // button only appear when at least one todo toggled
  const hideClearButton = todos.length > todosRemaining;

  const renderedFilters = Object.keys(StatusFilters).map((key) => {
    const value = StatusFilters[key];
    const handleClick = () => onStatusChange(value);
    const className = value === status ? "selected" : "";

    return (
      <li key={value}>
        <a styleName={className} href="#/" onClick={handleClick}>
          {key}
        </a>
      </li>
    );
  });

  return (
    <footer styleName="footer">
      <span styleName="todo-count">
        {todosRemaining} item{suffix} left
      </span>
      <ul styleName="filters">{renderedFilters}</ul>
      <button
        styleName={classNames("clear-button", {'hidden': !hideClearButton})}
        // hidden={!hideClearButton}
        onClick={onClearCompletedClicked}
      >
        Очистити завершені
      </button>
    </footer>
  );
}

export default CSSModules(Footer, styles, {allowMultiple: true});
