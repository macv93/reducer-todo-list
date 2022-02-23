import { v4 as uuidv4 } from "uuid";
import React, { useReducer, useState } from "react";
import "./App.css";

type Item = { name?: string; id?: string };
type Stuff = { items: Item[] };

const initialState: Stuff = { items: [] };

type Actions = "add" | "remove";

function reducer(state: Stuff, action: { type: Actions; payload: Item }) {
  const { type, payload } = action;

  switch (type) {
    case "add":
      let uniqueId = uuidv4();
      return { items: [...state.items, { ...payload, id: uniqueId }] };
    case "remove":
      return { items: state.items.filter((item) => item.id !== payload.id) };

    default:
      return state;
  }
}

function App() {
  const [{ items }, dispatch] = useReducer(reducer, initialState);

  const [input, setInput] = useState<string | undefined>("");

  const cleanUp = () => setInput("");

  const onEnter = (event: { key: string }) => {
    console.log("event key: ", event.key);

    if (event.key === "Enter") {
      if (input) {
        dispatch({ type: "add", payload: { name: input } });
      }
      cleanUp();
    }
  };

  return (
    <>
      <div className="App">
        <div>List</div>
        <input
          type="text"
          required
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyPress={(e) => {
            onEnter(e);
          }}
        />
        <ul>
          {items.length &&
            items.map(({ name, id }, index: number) => (
              <li key={`${uuidv4()}`}>
                  {name}
                  - 
                  <button
                    onClick={() => {
                      dispatch({ type: "remove", payload: { id } });
                    }}
                  >
                    X
                  </button>
              </li>
            ))}
        </ul>
        <button
          onClick={() => {
            if (input) {
              dispatch({ type: "add", payload: { name: input } });
            }
            cleanUp();
          }}
        >
          Add
        </button>
      </div>
    </>
  );
}

export default App;
