const Notes = ({ note, toggleImportance }) => {
  return (
    <li style={{ listStyle: "none" }}>
      {note.content}
      <button onClick={toggleImportance}>
        make {note.important ? "not" : ""} important
      </button>
    </li>
  );
};

export default Notes;
