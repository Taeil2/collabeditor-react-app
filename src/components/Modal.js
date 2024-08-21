import styled from "styled-components";

const Mask = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const ModalContainer = styled.div`
  border-radius: 5px;
  background: #fff;
  padding: 20px;
`;

export default function Modal(props) {
  const { children, closeButton, setShowModal } = props;

  return (
    <Mask>
      <ModalContainer>
        {children}
        {closeButton && <></>}
      </ModalContainer>
    </Mask>
  );
}
