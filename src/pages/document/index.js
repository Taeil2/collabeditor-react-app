import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Header from "./Header";
import Cursor from "./Cursor";

import { updateDocument, getDocument } from "../../server/documents";

import { io } from "socket.io-client";
import serverUrl from "../../server/serverUrl";

const Page = styled.div`
  width: 100%;
  background: #fff;
  // height: 1294px
  min-height: 1294.11765px; // 11 inch height: 1000px / 8.5 * 11 (for an 8.5x11 ratio)
  padding: 117.647059px; // 1 inch margins: 1 / 8.5 * 1000px
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  textarea {
    width: 100%;
    height: 1058.82353px; // 9 inch height: 1000px / 8.5 * 9
    height: 100px;
    resize: none;
    border: 0;
    border: 1px solid #eee;
    font-family: Noto Sans;
    font-size: 14px;
    caret-color: transparent;
  }
  .ghostDiv {
    width: 100%;
    height: 100px;
    border: 1px solid #eee;
    white-space: pre-wrap; // to investigate: break-spaces and pre-wrap work
  }
`;

// TODO: polish cursor tracking
export default function Document(props) {
  const { users, setUsers } = props;

  const [document, setDocument] = useState();
  const [value, setValue] = useState("");
  const dragging = useRef(false);
  const selection = useRef([0, 0]);
  const [selectionPosition, setSelectionPosition] = useState([
    [1, 0],
    [1, 0],
  ]);
  const ghostDivRef = useRef(null);
  const [ghostDivContent, setGhostDivContent] = useState();

  const socket = io(serverUrl);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const params = useParams();

  useEffect(() => {
    console.log("document", document);
  }, [document]);

  useEffect(() => {
    fetchDocument(params.id);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);
  }, []);

  function onConnect() {
    setIsConnected(true);
    console.log("connected");
  }

  function onDisconnect() {
    setIsConnected(false);
    console.log("disconnected");
  }

  function onFooEvent(value) {
    // setFooEvents((previous) => [...previous, value]);
  }

  const fetchDocument = async (id) => {
    const fetchedDocument = await getDocument(id);
    setDocument(fetchedDocument);
    setValue(fetchedDocument.content);

    // join socket.io for the room
    console.log(socket);
    console.log(socket.connected);
    // socket.join(fetchedDocument._id);
    // socket.emit("connect", fetchedDocument);
  };

  // const connectToSocketIo = (document) => {
  //   // socket.emit("chat message", input.value);

  //   // broadcast to all connected clients in the room
  //   io.to("some room").emit("hello", "world");

  //   // broadcast to all connected clients except those in the room
  //   io.except("some room").emit("hello", "world");

  //   // leave the room
  //   socket.leave("some room");
  // };

  // const fetchUsers = async () => {
  //   const fetchedUsers = await getUsers();
  //   setUsers(fetchedUsers);
  // };

  useEffect(() => {
    setGhostDiv();
  }, [value]);

  useEffect(() => {
    setCursor();
  }, [ghostDivContent]);

  const textareaOnChange = (e) => {
    setValue(e.target.value);
    selection.current = [e.target.selectionStart, e.target.selectionEnd];

    // TODO: store all document changes in a "state" across socket.io users. save the shared document at the right times.
    // after 500 ms of not typing in the header
    // after 500 ms of not typing in the body (any user)
    // after any collabeditor change
    // set a timer at 500 ms. if there are 500 ms in between key presses, save.
    const timer = setTimeout(() => {
      updateDocument(); // missing document data atm
    }, 500);
    clearInterval(timer);
  };

  // on mouse or key down
  const textareaMouseKeyDown = (e) => {
    dragging.current = true;
    selection.current = [e.target.selectionStart, e.target.selectionEnd];
    setGhostDiv();
    textareaDraggingScrolling(e);
  };

  // dragging or scrolling
  const textareaDraggingScrolling = (e) => {
    selection.current = [e.target.selectionStart, e.target.selectionEnd];
    setGhostDiv();
    setTimeout(() => {
      if (dragging.current) {
        textareaDraggingScrolling(e);
      }
    }, 100);
  };

  // on mouse or key up
  const textareaMouseKeyUp = (e) => {
    dragging.current = false;
    selection.current = [e.target.selectionStart, e.target.selectionEnd];
    setGhostDiv();
  };

  const setGhostDiv = () => {
    if (
      // cursor is at 0
      selection.current[0] === 0 &&
      selection.current[0] === selection.current[1]
    ) {
      setGhostDivContent(
        <>
          <span></span>
          {value}
        </>
      );
    } else if (selection.current[0] === selection.current[1]) {
      // cursor is at a single position
      const preCharacter = value.substring(0, selection.current[0] - 1);
      const character = value.substring(
        selection.current[0] - 1,
        selection.current[0]
      );
      const postCharacter = value.substring(selection.current[0], value.length);

      setGhostDivContent(
        <>
          {preCharacter}
          <span style={{ background: "red" }}>{character}</span>
          {postCharacter}
        </>
      );
    } else if (
      selection.current[0] === 0 &&
      selection.current[0] !== selection.current[1]
    ) {
      // selection is highlighted from 0 to somewhere
      const textSelection = value.substring(0, selection.current[1] - 1); // keyword selection is taken by the cursor selection
      const lastCharacter = value.substring(
        selection.current[1] - 1,
        selection.current[1]
      );
      const postSelection = value.substring(selection.current[1], value.length);

      setGhostDivContent(
        <>
          <span></span>
          {textSelection}
          <span style={{ background: "red" }}>{lastCharacter}</span>
          {postSelection}
        </>
      );
    } else {
      // selection is highlighted from somewhere to somewhere
      const preSelection = value.substring(0, selection.current[0] - 1);
      const firstCharacter = value.substring(
        selection.current[0] - 1,
        selection.current[0]
      );
      const midSelection = value.substring(
        selection.current[0],
        selection.current[1] - 1
      );
      const lastCharacter = value.substring(
        selection.current[1] - 1,
        selection.current[1]
      );
      const postSelection = value.substring(selection.current[1], value.length);

      setGhostDivContent(
        <>
          {preSelection}
          <span style={{ background: "red" }}>{firstCharacter}</span>
          {midSelection}
          <span style={{ background: "red" }}>{lastCharacter}</span>
          {postSelection}
        </>
      );
    }
  };

  const setCursor = () => {
    if (ghostDivRef.current.children.length) {
      // set first cursor
      const position1 = [
        ghostDivRef.current.children[0]?.offsetLeft +
          ghostDivRef.current.children[0]?.offsetWidth,
        ghostDivRef.current.children[0]?.offsetTop -
          ghostDivRef.current.offsetTop,
      ];
      let position2;
      if (ghostDivRef.current.children.length === 1) {
        // second is same as first
        position2 = [
          ghostDivRef.current.children[0]?.offsetLeft +
            ghostDivRef.current.children[0]?.offsetWidth,
          ghostDivRef.current.children[0]?.offsetTop -
            ghostDivRef.current.offsetTop,
        ];
      } else {
        // range is selected
        position2 = [
          ghostDivRef.current.children[1]?.offsetLeft +
            ghostDivRef.current.children[0]?.offsetWidth,
          ghostDivRef.current.children[1]?.offsetTop -
            ghostDivRef.current.offsetTop,
        ];
      }

      setSelectionPosition([position1, position2]);
    }
  };

  return (
    <>
      <Header document={document} setDocument={setDocument} users={users} />
      <Page>
        <Content>
          <textarea
            onChange={textareaOnChange}
            onMouseDown={textareaMouseKeyDown}
            onMouseUp={textareaMouseKeyUp}
            onKeyDown={(e) => {
              if (
                e.code === "ArrowUp" ||
                e.code === "ArrowRight" ||
                e.code === "ArrowDown" ||
                e.code === "ArrowLeft"
              ) {
                textareaMouseKeyDown(e);
              }
            }}
            onKeyUp={(e) => {
              if (
                e.code === "ArrowUp" ||
                e.code === "ArrowRight" ||
                e.code === "ArrowDown" ||
                e.code === "ArrowLeft"
              ) {
                textareaMouseKeyUp(e);
              }
            }}
            value={value}
          />
          <Cursor
            collabeditor={document?.owner}
            index={1}
            selectionPosition={selectionPosition}
          />
          <div className="ghostDiv" ref={ghostDivRef}>
            {ghostDivContent}
          </div>
        </Content>
      </Page>
    </>
  );
}
