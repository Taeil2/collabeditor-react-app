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
  align-items: center;
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
  const { document, setDocument, setShowModal, users } = props;

  const [name, setName] = useState("");
  const [selectedCollabeditor, setSelectedCollabeditor] = useState({});
  const [addPermissions, setAddPermissions] = useState("all");
  // remove this and use selectedCollabeditor instead
  const [nameSelected, setNameSelected] = useState(false);

  const updatePermissions = (e, collabeditor) => {
    const updatedCollabeditors = document.collabeditors.map((c) => {
      if (c.id !== collabeditor.id) {
        return c;
      } else {
        return {
          id: c.id,
          permissions: e.target.value,
        };
      }
    });

    updateDocument(
      {
        collabeditors: updatedCollabeditors,
      },
      document._id
    );
    setDocument({
      ...document,
      collabeditors: updatedCollabeditors,
    });
  };

  const removeCollabeditor = (e, collabeditor) => {
    const updatedCollabeditors = document.collabeditors.filter(
      (c) => c.id !== collabeditor.id
    );

    updateDocument(
      {
        collabeditors: updatedCollabeditors,
      },
      document._id
    );
    setDocument({
      ...document,
      collabeditors: updatedCollabeditors,
    });
  };

  // add collabeditor on form submit
  const onSubmit = (e) => {
    e.preventDefault();

    const updatedCollabeditors = [
      ...document.collabeditors,
      { id: selectedCollabeditor._id, permissions: addPermissions },
    ];

    updateDocument(
      {
        collabeditors: updatedCollabeditors,
      },
      document._id
    );
    setDocument({
      ...document,
      collabeditors: updatedCollabeditors,
    });

    setName("");
    setAddPermissions("all");
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
              <div className="name">
                {users?.filter((user) => user._id === collabeditor.id)[0].name}
              </div>
              <select
                onChange={(e) => {
                  updatePermissions(e, collabeditor);
                }}
                defaultValue={collabeditor.permissions}
              >
                <option
                  value="all"
                  selected={collabeditor.permissions === "all" ? true : false}
                >
                  all
                </option>
                <option
                  value="edit"
                  selected={collabeditor.permissions === "edit" ? true : false}
                >
                  edit
                </option>
                <option
                  value="view"
                  selected={collabeditor.permissions === "view" ? true : false}
                >
                  view
                </option>
              </select>
              <Button
                icon={<FaRegTrashAlt />}
                onClick={(e) => {
                  removeCollabeditor(e, collabeditor);
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
            defaultValue={addPermissions}
          >
            <option
              value="all"
              selected={addPermissions === "all" ? true : false}
            >
              all
            </option>
            <option
              value="edit"
              selected={addPermissions === "edit" ? true : false}
            >
              edit
            </option>
            <option
              value="view"
              selected={addPermissions === "view" ? true : false}
            >
              view
            </option>
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
