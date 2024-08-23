import styled from "styled-components";
import { useState } from "react";
import { colors } from "../../styles/styles";

import { Link } from "react-router-dom";

import Button from "../../components/Button";
import Collabeditor from "../../components/Collabeditor";
import CollabeditorsModal from "./CollabeditorsModal";
import { IoIosArrowBack } from "react-icons/io";
import { IoPeople } from "react-icons/io5";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  > div:first-of-type {
    flex: 1;
    margin-right: 20px;
    margin-bottom: 30px;
    a {
      color: ${colors.blue};
    }
    input {
      margin-top: 8px;
      display: block;
      width: 100%;
      background: transparent;
      border: 0;
      font-family: Open Sans;
      font-size: 32px;
      height: 41px; // it was cutting off descenders
    }
  }
  > div:last-of-type {
    margin-top: 32px;
  }
`;

export default function Header(props) {
  const [collabeditorsOpen, setCollabeditorsOpen] = useState(false);
  const { document } = props;

  const [documentName, setDocumentName] = useState(document?.name);

  const changeTitle = () => {
    setDocumentName();
  };

  return (
    <Container>
      <div>
        <Link to="/">
          <IoIosArrowBack /> back to documents
        </Link>
        <input
          type="text"
          placeholder="Document Name"
          value={documentName}
          onChange={changeTitle}
        />
      </div>
      <div>
        <Collabeditor
          collabeditor={document?.owner}
          index={0}
          key={`collabeditor-0`}
        />
        {document?.collabeditors?.map((collabeditor, i) => (
          <Collabeditor
            collabeditor={collabeditor}
            index={i + 1}
            key={`collabeditor-0${i + 1}`}
          />
        ))}
        <Button
          icon={<IoPeople />}
          text="collabeditors"
          onClick={() => {
            setCollabeditorsOpen(true);
          }}
        />
        {collabeditorsOpen && (
          <CollabeditorsModal
            document={document}
            setShowModal={setCollabeditorsOpen}
          />
        )}
      </div>
    </Container>
  );
}
