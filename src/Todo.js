import React, { useState, useEffect } from "react";
import { ListItem, List, ListItemText, Button, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import db from "./firebase";
import firebase from "firebase";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Todo(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [inputTodo, setInputTodo] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const updateTodo = () => {
    db.collection("todos").doc(props.todo.id).set(
      {
        todo: inputTodo,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
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
        Deltet Me
      </p>
      <button onClick={(e) => setOpen(true)}>Edit Me</button>
      <Modal open={open} onClose={(e) => setOpen(false)}>
        <div className={classes.paper}>
          <h1>I am a Modal</h1>
          <input
            placeholder={props.todo.todo}
            value={inputTodo}
            onChange={(event) => setInputTodo(event.target.value)}
          />
          <Button onClick={updateTodo}>Update TODO</Button>
        </div>
      </Modal>
      <hr></hr>
    </div>
  );
}

export default Todo;
