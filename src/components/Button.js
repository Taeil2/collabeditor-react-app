import styled from "styled-components";
import { colors } from "../styles/styles";

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  background: ${(props) => {
    if (props.$color === "red") {
      return colors.red;
    } else if (props.$color === "gray") {
      return colors.gray;
    } else {
      return colors.cyan;
    }
  }};
  &:hover {
    background: ${(props) => {
      if (props.$color === "red") {
        return colors.darkRed;
      } else if (props.$color === "gray") {
        return colors.darkGray;
      } else {
        return colors.darkCyan;
      }
    }};
  }
  height: 35px;
  padding: 0 10px;
  border-radius: 5px;
  border: 0;
  color: #fff;
  cursor: pointer;
  svg + span {
    margin-left: 10px;
  }
  transition: background 200ms linear;
`;

// color options are cyan, red, gray
export default function Button(props) {
  const { icon, text, onClick, color } = props;

  return (
    <StyledButton onClick={onClick} $color={color}>
      {icon}
      {text && <span>{text}</span>}
    </StyledButton>
  );
}
