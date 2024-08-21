import styled from 'styled-components'

import Button from './Button'

const ButtonContainer = styled.div`
  display: inline-block;
  border-radius: 5px;
  overflow: hidden;
  button {
    border-radius: 0 !important;
  }
  button + button {
    border-left: 1px solid #fff;
  }
`

export default function ButtonGroup(props) {
  const { buttons } = props

  return (
    <ButtonContainer>
      {buttons.map((button, i) => {
        const { icon, text, onClick } = button

        return (
          <Button
            icon={icon}
            text={text}
            onClick={onClick}
            key={i}
            color="gray"
          />
        )
      })}
    </ButtonContainer>
  )
}
