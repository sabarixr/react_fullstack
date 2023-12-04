import axios from "axios";
import React, { useState, useEffect } from "react";
import produce from "immer";
import "./App.css";
// I choose rest thinking there was less time and most of the blogs suggested this
const App = () => {
  const [note_element, setDetails] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000")
      .then((res) => {
        const data = res.data;
        setDetails(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleClick = () => {
    const deadline = document.querySelector("#deadline").value.trim();
    const text = document.querySelector("#noteinput").value.trim();
    if (text) {
      const Note = { text, deadline };
      axios.post("http://127.0.0.1:8000", Note);
      const nextState = produce(note_element, (draftState) => {
        draftState.push({ text, deadline });
      });
      document.querySelector("#noteinput").value = "";
      document.querySelector("#deadline").value = "";

      if (typeof window !== "undefined") {
        localStorage.setItem("data", JSON.stringify(nextState));
      }
      setDetails(nextState);
    }
  };
  const handledelete = (index) => {
    const nextState = produce(note_element, (draftState) => {
      draftState.splice(index, 1);
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("data", JSON.stringify(nextState));
    }
    setDetails(nextState);
  };

  return (
    <>
      <div className="container">
        <h1>Notes</h1>
        <div style={{ display: "flex", marginBottom: "30px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input id="noteinput" type="text" placeholder="Enter a new note" />

            <input
              type="text"
              id="deadline"
              placeholder="Enter deadline (day/month/year)"
            />
          </div>
          <button id="addnote" onClick={handleClick}>
            Add note
          </button>
        </div>
        <Notes data={note_element} deleteclick={handledelete} />
      </div>
    </>
  );
};

const Notes = (props) =>
  props.data.map((note, index) => {
    // checks any error in the objects
    if (!note || !note.deadline) {
      return null;
    }
    const dateParts = note.deadline.split("/");
    const [day, month, year] = dateParts;
    const formattedDate = `${month}/${day}/${year}`;

    return (
      <div
        className="notepart"
        style={{
          color: new Date(formattedDate) < new Date() ? "black" : "white",
          backgroundColor:
            new Date(formattedDate) < new Date() ? "#FF6656" : "#999999",
        }}
      >
        <div>{note.text}</div>
        <div>Deadline: {note.deadline}</div>
        <button id="deletebt" onClick={() => props.deleteclick(index)}>
          Delete
        </button>
      </div>
    );
  });

export default App;
// i wasn't able to get off the bug of sending an http request to delete the items i thought he deadlines was over
//as it wasn't informed in the group and only got news of it after others were sending their  status update and yeah wasted a day and a half like that TT
