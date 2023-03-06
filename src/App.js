import "./App.css";
// import NavBar from "./components/NavBar";
import Notes from "./components/Notes";
// import Login from "./components/Login";
import Notification from "./components/Notification";
import noteService from "./services/notes";
import { useState, useEffect } from "react";
import loginService from "./services/login";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    noteService.setToken(user.token);
    window.localStorage.removeItem("loggedNoteappUser");
  };

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5, //esto pa q ya salga en true o false de forma aleatoria
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));

      noteService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const renderLoginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            value={username}
            name="Username"
            placeholder="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            name="Password"
            placeholder="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    );
  };

  const renderCreateNoteForm = () => {
    return (
      <>
        <form onSubmit={addNote}>
          <input
            placeholder="Write a note content"
            value={newNote}
            onChange={handleNoteChange}
          />
          <button type="submit">save</button>
        </form>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </>
    );
  };

  return (
    <div className="App">
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user ? renderCreateNoteForm() : renderLoginForm()}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) => (
          <Notes
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
