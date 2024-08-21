import styled from "styled-components";

import Modal from "../../components/Modal";

import Button from "../../components/Button";
import { useState } from "react";
import { grays } from "../../styles/styles";

// import { useCombobox, useSelect } from "downshift";
import Collabeditor from "../../components/Collabeditor";
import { FaRegTrashAlt } from "react-icons/fa";

const CollabeditorRow = styled.div`
  display: grid;
  grid-template-columns: 25px 100px 100px 50px;
  column-gap: 10px;
  margin-bottom: 10px;
  .name {
    margin-top: 2px;
  }
  &.owner {
    margin-bottom: 3px;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 200px 50px 50px;
  column-gap: 10px;
  label {
    display: block;
    font-size: 16px;
    color: ${grays.gray6};
    margin-bottom: 10px;
  }
`;

const names = ["taeil", "taki", "tahoe", "taco"];

export default function CollabeditorsModal(props) {
  const { document } = props;

  const [name, setName] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Modal closeButton={true}>
      <h4>Collabeditors</h4>
      <CollabeditorRow>
        <div></div>
        <div></div>
        <label>Permissions</label>
        <div></div>
      </CollabeditorRow>
      <CollabeditorRow className="owner">
        <Collabeditor
          collabeditor={document?.owner}
          index={0}
          key={`collabeditor-0`}
          showTag={false}
        />
        <div className="name">{document?.owner.name}</div>
        <select>
          <option>all</option>
          <option>edit</option>
          <option>view</option>
        </select>
        <Button
          icon={<FaRegTrashAlt />}
          onClick={() => {
            console.log("clicked");
          }}
          color="red"
        />
      </CollabeditorRow>
      {document?.collabeditors.map((collabeditor, i) => (
        <CollabeditorRow>
          <Collabeditor
            collabeditor={collabeditor}
            index={i + 1}
            key={`collabeditor-0${i + 1}`}
            showTag={false}
          />
          <div className="name">{collabeditor?.name}</div>
          <select>
            <option>all</option>
            <option>edit</option>
            <option>view</option>
          </select>
          <Button
            icon={<FaRegTrashAlt />}
            onClick={() => {
              console.log("clicked");
            }}
            color="red"
          />
        </CollabeditorRow>
      ))}
      <h5>Add Collabeditor</h5>
      <Form onSubmit={onSubmit}>
        <div>
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <label for="permissions">Permissions</label>
          <select id="permissions">
            <option>all</option>
            <option>edit</option>
            <option>view</option>
          </select>
          <Button type="submit" text="okay" />
        </div>
      </Form>
    </Modal>
  );
}
