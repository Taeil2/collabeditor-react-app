import styled from "styled-components";

import Modal from "../../components/Modal";

import Button from "../../components/Button";
import { useState } from "react";
import { grays } from "../../styles/styles";

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
  const { setChangeNameOpen, currentUser } = props;

  const [name, setName] = useState(currentUser.name);

  const onSubmit = (e) => {
    e.preventDefault();

    if (name.match(/^ *$/) === null) {
      setChangeNameOpen(false);
    }
  };

  return (
    <Modal closeButton={false}>
      <Form onSubmit={onSubmit}>
        <label for="name">What is your name?</label>
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
