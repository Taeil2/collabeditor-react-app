import { useState } from "react";
import styled from "styled-components";

import Modal from "../../components/Modal";
import Button from "../../components/Button";

import { grays } from "../../styles/styles";

import { updateUser } from "../../server/users";

const Form = styled.form`
  label {
    display: block;
    font-size: 16px;
    color: ${grays.gray6};
    margin-bottom: 10px;
  }
  input {
    width: 200px;
    margin-right: 10px;
  }
`;

export default function NameModal(props) {
  const { setChangeNameOpen, currentUser, setCurrentUser, users, setUsers } =
    props;

  const [name, setName] = useState(currentUser.name);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (name.match(/^ *$/) === null) {
      setChangeNameOpen(false);
      await updateUser(name, currentUser._id);
      const userUpdate = { ...currentUser };
      userUpdate.name = name;
      setCurrentUser(userUpdate);

      // update the name in users, because the document cards query the users
      // the user name gets updated in the cards
      setUsers(
        users.map((user) => {
          if (user._id === currentUser._id) {
            return userUpdate;
          } else {
            return user;
          }
        })
      );
    }
  };

  return (
    <Modal closeButton={false}>
      <Form onSubmit={onSubmit}>
        <label htmlFor="name">What is your name?</label>
        <input
          id="name"
          type="text"
          value={name}
          placeholder=""
          onChange={(e) => {
            setName(e.target.value);
          }}
          autoFocus
        />
        <Button type="submit" text="okay" />
      </Form>
    </Modal>
  );
}
