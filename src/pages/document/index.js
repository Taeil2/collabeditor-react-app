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
  .ghostBody {
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
  const [collabeditors, setCollabeditors] = useState([]);

  // track own cursor
  const cursorLocation = useRef("header");
  const cursorCharLocation = useRef([0, 0]);
  const cursorPixelLocation = useRef([
    [1, 1],
    [1, 1],
  ]);
  const dragging = useRef(false);
  const ghostBodyRef = useRef(null);
  const ghostBodyContent = useRef("");

  // everyone's cursors
  const cursorLocations = useRef({});

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
    return () => {
      if (document.current) {
        socket.emit("leave", {
          document: document.current,
          user: currentUser,
        });
      }
    };
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
    setCollabeditors(updatedDocument.collabeditors);
  });

  // when someone leaves, update the current users
  socket.on("leave", (updatedDocument) => {
    document.current = updatedDocument;
    setCurrentUsers(updatedDocument.currentUsers);
  });

  socket.on("body", (updatedDocument) => {
    document.current = updatedDocument;
    bodyRef.current.value = updatedDocument.content;
  });

  socket.on("name", (updatedDocument) => {
    document.current = updatedDocument;
    nameRef.current.value = updatedDocument.name;
  });

  socket.on("collabeditors", (updatedDocument) => {
    document.current = updatedDocument;
    setCollabeditors(updatedDocument.collabeditors);
  });

  const textareaOnChange = (e) => {
    socket.emit("body", {
      document: document.current,
      // user: currentUser,
      body: e.target.value,
    });

    cursorLocation.current = "body";
    cursorCharLocation.current = [
      e.target.selectionStart,
      e.target.selectionEnd,
    ];
    setGhostBody();
  };

  // on mouse or key down
  const textareaMouseKeyDown = (e) => {
    dragging.current = true;

    cursorLocation.current = "body";
    cursorCharLocation.current = [
      e.target.selectionStart,
      e.target.selectionEnd,
    ];
    setGhostBody();
    textareaDraggingScrolling(e);
  };

  // dragging or scrolling
  const textareaDraggingScrolling = (e) => {
    cursorLocation.current = "body";
    cursorCharLocation.current = [
      e.target.selectionStart,
      e.target.selectionEnd,
    ];
    setGhostBody();
    setTimeout(() => {
      if (dragging.current) {
        textareaDraggingScrolling(e);
      }
    }, 100);
  };

  // on mouse or key up
  const textareaMouseKeyUp = (e) => {
    dragging.current = false;
    cursorLocation.current = "body";
    cursorCharLocation.current = [
      e.target.selectionStart,
      e.target.selectionEnd,
    ];
    setGhostBody();
  };

  const setGhostBody = () => {
    const content = document.current.content;
    if (
      // cursor is at 0
      cursorCharLocation.current[0] === 0 &&
      cursorCharLocation.current[0] === cursorCharLocation.current[1]
    ) {
      ghostBodyRef.current.innerHTML = `<span></span>${content}</>`;

      setCursor();
    } else if (
      cursorCharLocation.current[0] === cursorCharLocation.current[1]
    ) {
      // cursor is at a single position
      const preCharacter = content.substring(
        0,
        cursorCharLocation.current[0] - 1
      );
      const character = content.substring(
        cursorCharLocation.current[0] - 1,
        cursorCharLocation.current[0]
      );
      const postCharacter = content.substring(
        cursorCharLocation.current[0],
        content.length
      );

      ghostBodyRef.current.innerHTML = `${preCharacter}<span style="background:red;">${character}</span>${postCharacter}`;

      setCursor();
    } else if (
      cursorCharLocation.current[0] === 0 &&
      cursorCharLocation.current[0] !== cursorCharLocation.current[1]
    ) {
      // selection is highlighted from 0 to somewhere
      const textSelection = content.substring(
        0,
        cursorCharLocation.current[1] - 1
      ); // keyword selection is taken by the cursor selection
      const lastCharacter = content.substring(
        cursorCharLocation.current[1] - 1,
        cursorCharLocation.current[1]
      );
      const postSelection = content.substring(
        cursorCharLocation.current[1],
        content.length
      );

      ghostBodyRef.current.innerHTML = `<span></span>${textSelection}<span style="background:red;">${lastCharacter}</span>${postSelection}`;
      setCursor();
    } else {
      // selection is highlighted from somewhere to somewhere
      const preSelection = content.substring(
        0,
        cursorCharLocation.current[0] - 1
      );
      const firstCharacter = content.substring(
        cursorCharLocation.current[0] - 1,
        cursorCharLocation.current[0]
      );
      const midSelection = content.substring(
        cursorCharLocation.current[0],
        cursorCharLocation.current[1] - 1
      );
      const lastCharacter = content.substring(
        cursorCharLocation.current[1] - 1,
        cursorCharLocation.current[1]
      );
      const postSelection = content.substring(
        cursorCharLocation.current[1],
        content.length
      );

      ghostBodyRef.current.innerHTML = `${preSelection}<span style="background:red;">${firstCharacter}</span>${midSelection}<span style="background:red;">${lastCharacter}</span>${postSelection}`;
      setCursor();
    }
  };

  const setCursor = () => {
    if (ghostBodyRef.current.children.length) {
      // set first cursor
      const position1 = [
        ghostBodyRef.current.children[0]?.offsetLeft +
          ghostBodyRef.current.children[0]?.offsetWidth,
        ghostBodyRef.current.children[0]?.offsetTop -
          ghostBodyRef.current.offsetTop,
      ];
      let position2;
      if (ghostBodyRef.current.children.length === 1) {
        // second is same as first
        position2 = [
          ghostBodyRef.current.children[0]?.offsetLeft +
            ghostBodyRef.current.children[0]?.offsetWidth,
          ghostBodyRef.current.children[0]?.offsetTop -
            ghostBodyRef.current.offsetTop,
        ];
      } else {
        // range is selected
        position2 = [
          ghostBodyRef.current.children[1]?.offsetLeft +
            ghostBodyRef.current.children[0]?.offsetWidth,
          ghostBodyRef.current.children[1]?.offsetTop -
            ghostBodyRef.current.offsetTop,
        ];
      }

      cursorPixelLocation.current = [position1, position2];
      console.log(cursorPixelLocation.current[0]);
      console.log(cursorPixelLocation.current[1]);
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
        collabeditors={collabeditors}
        setCollabeditors={setCollabeditors}
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
            collabeditor={document.current ? document.current.owner : ""}
            index={1}
            cursorPixelLocation={cursorPixelLocation}
            users={users}
          />
          <div className="ghostBody" ref={ghostBodyRef}>
            {ghostBodyContent.current}
          </div>
        </Content>
      </Page>
    </>
  );
}
