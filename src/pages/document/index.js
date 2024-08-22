import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";

import Header from "./Header";
import Cursor from "./Cursor";

import sampleDocuments from "../../sampleDocuments";

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
    // caret-color: transparent;
  }
  .ghostDiv {
    width: 100%;
    height: 100px;
    border: 1px solid #eee;
  }
`;

export default function Document() {
  const [document, setDocument] = useState();
  const [value, setValue] = useState();
  const dragging = useRef(false);
  const selection = useRef([0, 0]);
  const [selectionPosition, setSelectionPosition] = useState([
    [1, 0],
    [1, 0],
  ]);
  const ghostDivRef = useRef(null);
  const [ghostDivContent, setGhostDivContent] = useState();

  const params = useParams();

  useEffect(() => {
    fetch(`http://localhost:5050/documents/${params.id}`)
      .then((resp) => resp.json())
      .then((json) => {
        setDocument(json);
        setValue(json.content);
      });
  }, []);

  useEffect(() => {
    setGhostDiv();
  }, [value]);

  useEffect(() => {
    setCursor();
  }, [ghostDivContent]);

  const textareaOnChange = (e) => {
    setValue(e.target.value);
    selection.current = [e.target.selectionStart, e.target.selectionEnd];
  };

  const textareaMouseDown = (e) => {
    dragging.current = true;
    selection.current = [e.target.selectionStart, e.target.selectionEnd];
    setGhostDiv();
    textareaDragging(e);
  };

  const textareaDragging = (e) => {
    selection.current = [e.target.selectionStart, e.target.selectionEnd];
    setGhostDiv();
    setTimeout(() => {
      if (dragging.current) {
        textareaDragging(e);
      }
    }, 100);
  };

  const textareaMouseUp = (e) => {
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
      <Header document={document} />
      <Page>
        <Content>
          <textarea
            onMouseDown={textareaMouseDown}
            onMouseUp={textareaMouseUp}
            onChange={textareaOnChange}
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
