import styled from "styled-components";
import { useState } from "react";

import Button from "../../components/Button";
import ButtonGroup from "../../components/ButtonGroup";

import { FaPlus } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

import { useAuth0 } from "@auth0/auth0-react";
import NameModal from "./NameModal";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  > div:first-of-type {
    display: flex;
    align-items: center;
  }
  h2 {
    display: inline-block;
    margin-right: 30px;
  }
`;

export default function Header() {
  const [changeNameOpen, setChangeNameOpen] = useState(false);
  const { logout } = useAuth0();

  return (
    <Container>
      <div>
        <h2>Documents</h2>
        <Button
          icon={<FaPlus />}
          text="new document"
          onClick={() => {
            console.log("clicked");
          }}
        />
      </div>
      <ButtonGroup
        buttons={[
          {
            icon: <FaPen />,
            text: "change name",
            onClick: () => {
              setChangeNameOpen(true);
            },
          },
          {
            icon: <MdLogout />,
            text: "log out",
            onClick: () => {
              logout({ logoutParams: { returnTo: window.location.origin } });
            },
          },
        ]}
      />
      {changeNameOpen && <NameModal setChangeNameOpen={setChangeNameOpen} />}
    </Container>
  );
}
