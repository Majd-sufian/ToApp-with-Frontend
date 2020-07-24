import React, { useState, useEffect } from "react";
import { ListItem, List, ListItemText, Button, Modal } from "@material-ui/core";
import { db } from "./firebase";
import { useStyles } from "./useStyles";
import firebase from "firebase";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import EditIcon from "@material-ui/icons/Edit";
import "./Todo.css";

function Todo(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const updateTodo = () => {
    db.collection("todos").doc(props.todo.id).set(
      {
        todo: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: props.username,
      },
      { merge: true }
    );

    setOpen(false);
  };
  return (
    <div>
      <div className="todo__box">
        <div className="todo__first__row">
          <HighlightOffTwoToneIcon
            // fontSize="large"
            color="secondary"
            className="todo__remove__icon"
            onClick={(event) =>
              db.collection("todos").doc(props.todo.id).delete()
            }
          />
          <div className="todo__todo">{props.todo.todo}</div>
        </div>
        <EditIcon
          // fontSize="large"
          className="todo__edit__icon"
          onClick={(e) => setOpen(true)}
        />
      </div>
      <Modal open={open} onClose={(e) => setOpen(false)}>
        <div className={classes.paper}>
          <input
            placeholder={props.todo.todo}
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button onClick={updateTodo}>Update TODO</Button>
        </div>
      </Modal>
    </div>
  );
}

export default Todo;
