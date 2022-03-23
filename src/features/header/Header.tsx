import React, { useState } from "react";
import CSSModules from "react-css-modules";
import { useAppDispatch } from "../../app/hooks";
import { todoAdded } from "../todos/todosSlice";
import styles from "./Header.module.scss";

function Header() {
  const [text, setText] = useState("");
  const dispatch = useAppDispatch();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmedText = text.trim();
    if (e.key === "Enter" && trimmedText) {
      dispatch(todoAdded(trimmedText));
      setText("");
    }
  };
  return (
    <header styleName="header">
      <h1>todos</h1>
      <input
        className="input"
        styleName="input"
        placeholder="Що потрібно зробити?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </header>
  );
}

export default CSSModules(Header, styles);
