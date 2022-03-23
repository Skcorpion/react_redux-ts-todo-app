import React, { useEffect, useRef, useState } from "react";
import CSSModules from "react-css-modules";
import styles from "./TodoListItem.module.scss";
import { parseISO, formatDistanceToNow } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectTodoById,
  setTodoEditingId,
  todoDeleted,
  todoEdited,
  todoToggled,
} from "./todosSlice";
import classNames from "classnames";

type Props = {
  id: string;
};

function TodoListItem({ id }: Props) {
  const dispatch = useAppDispatch();
  const todo = useAppSelector((state) => selectTodoById(state, id));
  const editing = useAppSelector((state) => state.todos.todoEditedId) === id;
  const [editingText, setEditingText] = useState("");

  /* https://stackoverflow.com/questions/32553158/detect-click-outside-react-component */
  function useOutsideSaver(ref: any) {
    useEffect(() => {
      /**
       * Trigger if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          const trimmedText = editingText.trim();
          if (trimmedText) {
            dispatch(todoEdited(id, trimmedText));
            dispatch(setTodoEditingId(null));
          } else {
            dispatch(setTodoEditingId(null));
          }
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [editingText]);
  }

  // https://blog.maisie.ink/react-ref-autofocus/
  function useAutofocusAndChangeHeight(ref: any) {
    useEffect(() => {
      if (ref.current) {
        ref.current.focus();

        /**
         * Textarea autoheight:
         * https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
         * (box-sizing must be border-box)
         */

        const tx = ref.current;
        tx.style.height = tx.scrollHeight + "px";
        tx.addEventListener("input", OnInput, false);
        
        return () => {
          tx.removeEventListener("input", OnInput, false);
        };
      }
    }, [editing]);
  }
  
  function OnInput(this: any) {
    this.style.height = "auto";
    
    const emptyFieldSizeFix = this.value === '' ? 1 : 0
    this.style.height = this.scrollHeight + emptyFieldSizeFix + "px";
  }

  function useMountTextareaHeight(ref: any) {
    useEffect(() => {
      const tx = ref.current;
      tx.style.height = tx.scrollHeight + "px";
    }, [])
  }

  const wrapperRef = useRef(null);
  const mountRef = useRef(null);
  useMountTextareaHeight(mountRef);
  useOutsideSaver(wrapperRef);
  useAutofocusAndChangeHeight(wrapperRef);

  

  if (todo) {
    const { text, completed, date: timestamp, edited } = todo;

    const handleCompletedChange = () => {
      dispatch(todoToggled(todo.id));
    };

    const onDelete = () => {
      dispatch(todoDeleted(todo.id));
    };

    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNow(date);
    const editedPrefix = edited ? "edited" : "created";
    const timeAgo = `${editedPrefix} ${timePeriod} ago`;

    const handleEditClick = (
      e: React.MouseEvent<HTMLLabelElement, MouseEvent>
    ) => {
      if (e.detail === 1 && !editing) {
        setEditingText(text);
        dispatch(setTodoEditingId(id));
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const trimmedText = editingText.trim();
      if (e.key === "Enter" && trimmedText) {
        dispatch(todoEdited(id, trimmedText));
        dispatch(setTodoEditingId(null));
      }
    };

    return (
      <li
        styleName={classNames("li", { completed: completed })}
      >
        <div styleName="view">
          <input
            styleName="toggle"
            type="checkbox"
            checked={completed}
            onChange={handleCompletedChange}
          />
          <label onClick={handleEditClick}>
            <textarea
              rows={1}
              styleName="edit textarea"
              ref={editing ? wrapperRef : mountRef}
              value={editingText === '' && !editing ? text : editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onKeyDown={handleKeyDown}
              readOnly={!editing}
            />
            <span styleName="time">{timeAgo}</span>
          </label>
          <button styleName="destroy" onClick={onDelete} />
        </div>
      </li>
    );
  }
  return <></>;
}

export default CSSModules(TodoListItem, styles, { allowMultiple: true });
