import styled from 'styled-components'
import { colors, grays } from '../styles/styles'

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  background: ${(props) => {
    if (props.$color === 'red') {
      return colors.red
    } else if (props.$color === 'gray') {
      return colors.gray
    } else if (props.$color === 'transparent') {
      return 'transparent'
    } else {
      return colors.cyan
    }
  }};
  &:hover {
    background: ${(props) => {
      if (props.$color === 'red') {
        return colors.darkRed
      } else if (props.$color === 'gray') {
        return colors.darkGray
      } else if (props.$color === 'transparent') {
        return 'transparent'
      } else {
        return colors.darkCyan
      }
    }};
  }
  &:disabled {
    background: ${(props) => {
      if (props.$color === 'red') {
        return colors.lightRed
      } else if (props.$color === 'gray') {
        return colors.lightGray
      } else if (props.$color === 'transparent') {
        return 'transparent'
      } else {
        return colors.lightCyan
      }
    }};
  }
  height: 35px;
  padding: 0 10px;
  border-radius: 5px;
  border: 0;
  // color: #fff;
  color: ${(props) => {
    if (props.$color === 'transparent') {
      return grays.gray8
    } else {
      return '#fff'
    }
  }};
  cursor: pointer;
  svg + span {
    margin-left: 10px;
  }
  transition: background 200ms linear;
`

// color options are cyan, red, gray
export default function Button(props) {
  const { icon, text, onClick, color, ...otherProps } = props

  return (
    <StyledButton onClick={onClick} $color={color} {...otherProps}>
      {icon}
      {text && <span>{text}</span>}
    </StyledButton>
  )
}
