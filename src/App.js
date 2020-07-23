import React, { useState, useEffect } from "react";
import ToDo from "./Todo";
import db from "./firebase";
import firebase from "firebase";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    db.collection("todos").onSnapshot((snapshot) => {
      setTodos(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          todo: doc.data().todo,
          username: doc.data().username,
        }))
      );
    });
  }, []);

  const x = todos.filter((todo) => {
    return todo.username === "majd";
  });

  console.log(x);

  const addTodo = (event) => {
    event.preventDefault();

    db.collection("todos").add({
      todo: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };

  return (
    <div className="App">
      <form>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button
          disabled={!input}
          variant="outlined"
          color="secondary"
          type="submit"
          onClick={addTodo}
        >
          Add ToDo
        </button>
      </form>

      <ul>
        {todos.map((todo) => (
          <ToDo todo={todo} />
        ))}
      </ul>
    </div>
  );
}

export default App;
