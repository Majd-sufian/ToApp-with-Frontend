import React, { useState, useEffect } from "react";
import { ListItem, List, ListItemText, Button, Modal } from "@material-ui/core";
import { db } from "./firebase";
import { useStyles } from "./useStyles";
import firebase from "firebase";

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
      <p>{props.todo.todo}</p>
      <p>{props.todo.username}</p>
      <p>{props.todo.id}</p>
      <p
        onClick={(event) => db.collection("todos").doc(props.todo.id).delete()}
      >
        Delete ME
      </p>
      <button onClick={(e) => setOpen(true)}>Edit Me</button>
      <Modal open={open} onClose={(e) => setOpen(false)}>
        <div className={classes.paper}>
          <h1>I am a Modal</h1>
          <input
            placeholder={props.todo.todo}
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button onClick={updateTodo}>Update TODO</Button>
        </div>
      </Modal>
      <hr></hr>
    </div>
  );
}

export default Todo;
