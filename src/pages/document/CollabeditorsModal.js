import styled from "styled-components";

import Modal from "../../components/Modal";

import Button from "../../components/Button";
import { useState } from "react";
import { grays } from "../../styles/styles";

// import { useCombobox, useSelect } from "downshift";
import Autocomplete from "../../components/AutoComplete";
import Collabeditor from "../../components/Collabeditor";
import { FaRegTrashAlt } from "react-icons/fa";

import { updateDocument } from "../../server/documents";

const CollabeditorRow = styled.div`
  display: grid;
  // grid-template-columns: 25px 100px 100px 50px; // to enable collabeditor circles
  grid-template-columns: 100px 100px 50px;
  column-gap: 10px;
  margin-bottom: 10px;
  &.permissions-label {
    margin-bottom: 5px;
  }
  .name {
    margin-top: 2px;
  }
  // &.owner {
  //   margin-bottom: 3px;
  // }
  button {
    width: fit-content;
  }
`;

const Form = styled.form`
  & > div {
    display: grid;
    grid-template-columns: 200px 100px 50px;
    column-gap: 10px;
  }
  label {
    display: block;
    font-size: 16px;
    color: ${grays.gray6};
    margin-bottom: 10px;
  }
  button {
    width: fit-content;
  }
`;

export default function CollabeditorsModal(props) {
  const { document, setDocument, setShowModal, users, collabeditors } = props;

  const [name, setName] = useState("");
  const [selectedCollabeditor, setSelectedCollabeditor] = useState({});
  const [addPermissions, setAddPermissions] = useState();
  // remove this and use selectedCollabeditor instead
  const [nameSelected, setNameSelected] = useState(false);

  const addCollabeditor = (id, permissions) => {
    updateDocument([...collabeditors, { id, permissions }]);
  };

  const updatePermissions = (e, collabeditor) => {
    console.log(e, collabeditor);
    // update permissions of user updated
  };

  const removeCollabeditor = (id) => {
    updateDocument();
    // remove id
  };

  // add collabeditor on form submit
  const onSubmit = (e) => {
    e.preventDefault();

    updateDocument({
      collabeditors: [
        ...collabeditors,
        { id: selectedCollabeditor._id, permissions: addPermissions },
      ],
    });
    setDocument({
      ...document,
      collabeditors: [
        ...collabeditors,
        { id: selectedCollabeditor._id, permissions: addPermissions },
      ],
    });
    // updateDocument();
  };

  // collabeditors: [id, permission]

  // const { value, setValue, options, setNameSelected } = props;
  // const [autocompleteList, setAutocompleteList] = useState([]);
  // const [selectedIndex, setSelectedIndex] = useState(-1);
  // const [selectedOption, setSelectedOption] = useState();
  // const optionsRef = useRef();

  return (
    <Modal
      closeButton={true}
      setShowModal={setShowModal}
      clickMaskToClose={true}
    >
      <h4>Collabeditors</h4>
      {
        <div>
          <CollabeditorRow className="permissions-label">
            {/* <div></div> */}
            <div></div>
            <label>Permissions</label>
            <div></div>
          </CollabeditorRow>
          <CollabeditorRow className="owner" key={`collabeditor-1`}>
            {/* <Collabeditor
              collabeditor={document?.owner}
              index={0}
              key={`collabeditor-0`}
              showTag={false}
            /> */}
            <div className="name">
              {users?.filter((user) => user._id === document.owner)[0].name}
            </div>
            <div>owner</div>
            <div></div>
          </CollabeditorRow>
          {document?.collabeditors.map((collabeditor, i) => (
            <CollabeditorRow key={`collabeditor-${i}`}>
              {/* <Collabeditor
                collabeditor={collabeditor}
                index={i + 1}
                key={`collabeditor-0${i + 1}`}
                showTag={false}
              /> */}
              <div className="name">{collabeditor?.name}</div>
              <select
                onChange={(e) => {
                  updatePermissions(e, collabeditor);
                }}
              >
                <option value="all">all</option>
                <option value="edit">edit</option>
                <option value="view">view</option>
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
        </div>
      }
      <h5>Add Collabeditor</h5>
      <Form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <label htmlFor="permissions">Permissions</label>
        </div>
        <div>
          <Autocomplete
            options={users}
            value={name}
            setValue={setName}
            setNameSelected={setNameSelected}
            selectedCollabeditor={selectedCollabeditor}
            setSelectedCollabeditor={setSelectedCollabeditor}
          />
          <select
            id="permissions"
            onChange={(e) => {
              setAddPermissions(e.target.value);
            }}
          >
            <option value="all">all</option>
            <option value="edit">edit</option>
            <option value="view">view</option>
          </select>
          <Button
            type="submit"
            text="add"
            disabled={nameSelected ? false : true}
          />
        </div>
      </Form>
    </Modal>
  );
}
