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
  const { users, setUsers, currentUser, setCurrentUser } = props;

  // document
  const documentFetched = useRef(false);
  const document = useRef();

  // content
  const nameRef = useRef();
  const bodyRef = useRef();
  const [currentUsers, setCurrentUsers] = useState({});
  const [value, setValue] = useState("");

  // cursor tracking
  const [cursorLocation, setCursorLocation] = useState([0, 0]);
  const [cursorCharLocation, setCursorCharLocation] = useState([
    [1, 1],
    [1, 1],
  ]);
  const dragging = useRef(false);
  const selection = useRef([0, 0]);

  const characterPosition = useRef([0, 0]); // character position
  const [selectionPosition, setSelectionPosition] = useState([
    [1, 0],
    [1, 0],
  ]); // cursor position (by pixel, x and y)
  const ghostDivRef = useRef(null);
  const [ghostDivContent, setGhostDivContent] = useState();

  const socket = io(serverUrl);

  const params = useParams();

  // when current user has loaded, fetch the document
  useEffect(() => {
    if (currentUser && !documentFetched.current) {
      fetchDocument(params.id);
    }
  }, [currentUser]);

  // on disconnect, leave the socket.io room
  useEffect(() => {
    // socket.on("connect", onConnect); // ignoring on connect function (left as a note)

    return () => {
      if (document.current) {
        socket.emit("leave", {
          document: document.current,
          user: currentUser,
        });
      }
    };
    // socket.on("disconnect", () => {
    //   console.log("disconnecting");
    //   if (document.current) {
    //     console.log("leaving");
    //     socket.emit("leave", {
    //       document: document,
    //       user: currentUser,
    //     });
    //   }
    // });
  }, []);

  const fetchDocument = async (id) => {
    const fetchedDocument = await getDocument(id);

    socket.emit("join", {
      document: fetchedDocument,
      user: currentUser,
    });
  };

  // when anyone joins, update the document
  socket.on("join", (updatedDocument) => {
    document.current = updatedDocument;
    if (bodyRef.current) {
      bodyRef.current.value = updatedDocument?.content;
    }
    if (nameRef.current) {
      nameRef.current.value = updatedDocument?.name;
    }
    setCurrentUsers(updatedDocument.currentUsers);
  });

  // when someone leaves, update the current users
  socket.on("leave", (updatedDocument) => {
    document.current = updatedDocument;
    setCurrentUsers(updatedDocument.currentUsers);
    console.log("updating users", updatedDocument.currentUsers);
  });

  socket.on("body", (updatedDocument) => {
    document.current = updatedDocument;
    bodyRef.current.value = updatedDocument.content;
    // update other things as well.
  });

  socket.on("name", (updatedDocument) => {
    document.current = updatedDocument;
    nameRef.current.value = updatedDocument.name;
  });

  // useEffect(() => {
  //   setGhostDiv();
  // }, [value]);

  // useEffect(() => {
  //   setCursor();
  // }, [ghostDivContent]);

  const textareaOnChange = (e) => {
    socket.emit("body", {
      document: document.current,
      // user: currentUser,
      body: e.target.value,
    });
    // selection.current = [e.target.selectionStart, e.target.selectionEnd];
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
      <Header
        document={document}
        currentUsers={currentUsers}
        users={users}
        nameRef={nameRef}
        socket={socket}
      />
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
            ref={bodyRef}
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
