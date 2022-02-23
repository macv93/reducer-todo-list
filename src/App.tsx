import React, { useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

type Item = { name?: string; id?: string; isCompleted?: boolean };
type List = { items: Item[] };

const INITIAL_STATE: List = { items: [] };

const ADD = "add" as const;
const REMOVE = "remove" as const;
const TOGGLE = "toggle" as const;

const OPERATIONS = {
  ADD,
  REMOVE,
  TOGGLE,
};

const actions = [ADD, REMOVE, TOGGLE];

type Actions = typeof actions[number];

function reducer(state: List, action: { type: Actions; payload: Item }): List {
  const { type, payload } = action;

  switch (type) {
    case ADD:
      let uniqueId = uuidv4();
      return {
        items: [...state.items, { ...payload, id: uniqueId, isCompleted: false }],
      };
    case REMOVE:
      return { items: state.items.filter((item) => item.id !== payload.id) };
    case TOGGLE:
      const itemIndex = state.items.findIndex((item) => item.id === payload.id);
      state.items[itemIndex].isCompleted = payload.isCompleted;
      return {
        items: state.items,
      };
    default:
      return state;
  }
}

function App() {
  const [{ items }, dispatch] = useReducer(reducer, INITIAL_STATE);

  const [input, setInput] = useState<string | undefined>("");

  const cleanUp = () => setInput("");

  const onEnter = (event: { key: string }) => {
    console.log("event key: ", event.key);

    if (event.key === "Enter" && input) {
      dispatch({ type: OPERATIONS.ADD, payload: { name: input } });
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
            items.map(({ name, id, isCompleted }) => (
              <li key={`${uuidv4()}`}>
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => {
                    dispatch({ type: OPERATIONS.TOGGLE, payload: { id, isCompleted: e.target.checked} });
                  }}
                />
                {isCompleted ? <s>{name}</s> : <span>{name}</span> }
                <button
                  onClick={() => {
                    dispatch({ type: OPERATIONS.REMOVE, payload: { id } });
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
              dispatch({ type: OPERATIONS.ADD, payload: { name: input } });
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
