import React, { useState, useEffect } from "react";
import ToDo from "./Todo";
import { db } from "./firebase";
import { auth } from "firebase";
import { makeStyles, Button, Modal, Input } from "@material-ui/core";
import { useStyles, getModalStyle } from "./useStyles";
import firebase from "firebase";
import Icon from "@material-ui/core/Icon";
import "./App.css";

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        setUser(authUser);

        if (authUser.displayName) {
          // dont update username
        } else {
          // if we just created someone
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        // user has logged out
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  const signUp = (event) => {
    event.preventDefault();
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  useEffect(() => {
    db.collection("todos")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            todo: doc.data().todo,
            username: doc.data().username,
          }))
        );
      });
  }, []);

  const addTodo = (event) => {
    event.preventDefault();

    db.collection("todos").add({
      todo: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user?.displayName,
    });
    setInput("");
  };

  const userTodos = todos.filter((todo) => {
    return todo.username === user?.displayName;
  });

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <div className="app__logo__2">
          <h1>TODO APP</h1>
        </div>
        <div className="app__logo">
          <div>Majd Developer</div>
        </div>

        <div className="app__user__authentication">
          {user ? (
            <div className="app__loginContainer">
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => auth().signOut()}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="app__loginContainer">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenSignIn(true)}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpen(true)}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      {user ? (
        <div>
          <div>
            <h1 className="app__user__todo">Your ToDos 🔥🚀</h1>
            <ul>
              {userTodos.map((todo) => (
                <div>
                  <ToDo todo={todo} />
                </div>
              ))}
            </ul>
          </div>

          <div className="app__add__todo">
            <form className="app__add__todo__form">
              <input
                placeholder="Add Todo"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <Button
                onClick={input.length > 0 ? addTodo : ""}
                variant="contained"
                color="primary"
                type="submit"
              >
                Add ToDo
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="app__loginContainer-2">
          <h1>LogIn to add some Todos</h1>
        </div>
      )}
    </div>
  );
}

export default App;
