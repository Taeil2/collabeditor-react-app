import styled from 'styled-components'
import Button from './Button'

import { IoClose } from 'react-icons/io5'

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
  z-index: 2;
`

const ModalContainer = styled.div`
  border-radius: 5px;
  background: #fff;
  padding: 20px;
  position: relative;
  & .closeButton {
    position: absolute;
    top: 12px;
    right: 12px;
    svg {
      width: 20px;
      height: 20px;
    }
  }
`

export default function Modal(props) {
  const {
    children,
    clickMaskToClose = false,
    closeButton,
    setShowModal = () => {},
  } = props

  return (
    <Mask
      onClick={(e) => {
        if (clickMaskToClose && e.target.id === 'mask') {
          setShowModal(false)
        }
      }}
      id="mask"
    >
      <ModalContainer>
        {children}
        {closeButton && (
          <Button
            icon={<IoClose />}
            onClick={() => {
              setShowModal(false)
            }}
            color="transparent"
            className="closeButton"
          />
        )}
      </ModalContainer>
    </Mask>
  )
}
