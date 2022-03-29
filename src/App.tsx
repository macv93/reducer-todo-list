import Icon, {
  BulbTwoTone,
  ClearOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, Input, List } from "antd";
import React, { useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

type Item = { name?: string; id?: string; isCompleted?: boolean };
type ListItems = { items: Item[] };

const INITIAL_STATE: ListItems = {
  items: [{ name: "Add your own items to the list", isCompleted: false }],
};

const ADD = "add" as const;
const REMOVE = "remove" as const;
const TOGGLE = "toggle" as const;
const CLEAR = "clear" as const;

const OPERATIONS = {
  ADD,
  REMOVE,
  TOGGLE,
  CLEAR,
};

const actions = Object.values(OPERATIONS);

type Actions = typeof actions[number];

function reducer(
  state: ListItems,
  action: { type: Actions; payload?: Item }
): ListItems {
  const { type, payload } = action;

  switch (type) {
    case ADD:
      let uniqueId = uuidv4();
      return {
        items: [
          ...state.items,
          { ...payload, id: uniqueId, isCompleted: false },
        ],
      };
    case REMOVE:
      if (!payload) {
        return state;
      }
      return { items: state.items.filter((item) => item.id !== payload.id) };
    case TOGGLE:
      if (!payload) {
        return state;
      }
      const itemIndex = state.items.findIndex((item) => item.id === payload.id);
      state.items[itemIndex].isCompleted = payload.isCompleted;
      return {
        items: state.items,
      };
    case CLEAR:
      return { items: [] };
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
        <div>My todo-list</div>
        <Input
          size="large"
          type="text"
          placeholder="What do you need to get done today?"
          required
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyPress={(e) => {
            onEnter(e);
          }}
        />

        <List
          bordered
          locale={{ emptyText: <BulbTwoTone /> }}
          dataSource={items}
          renderItem={({ name, id, isCompleted }) => (
            <>
              <List.Item>
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => {
                    dispatch({
                      type: OPERATIONS.TOGGLE,
                      payload: { id, isCompleted: e.target.checked },
                    });
                  }}
                />
                {isCompleted ? <s>{name}</s> : <span>{name}</span>}
                <Button
                  onClick={() => {
                    dispatch({ type: OPERATIONS.REMOVE, payload: { id } });
                  }}
                >
                  <DeleteOutlined />
                </Button>
              </List.Item>
            </>
          )}
        />

        <Button
          onClick={() => {
            if (input) {
              dispatch({ type: OPERATIONS.ADD, payload: { name: input } });
            }
            cleanUp();
          }}
        >
          Add
        </Button>
        <Button>
          <ClearOutlined
            onClick={() => {
              dispatch({ type: OPERATIONS.CLEAR });
            }}
          >
            Clear All
          </ClearOutlined>
        </Button>
      </div>
    </>
  );
}

export default App;
