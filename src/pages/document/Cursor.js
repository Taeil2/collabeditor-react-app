import styled from "styled-components";
import { colors } from "../../styles/styles";

const colorsArr = Object.keys(colors).map((key) => [colors[key]]);

const Line = styled.div`
  position: absolute;
  width: 2px;
  height: 19px;
  left: ${(props) => `${props.$selectionPosition[0][0]}px`};
  top: ${(props) => `${props.$selectionPosition[0][1]}px`};
  background: ${(props) => {
    if (props.$index < 5) {
      return colorsArr[props.$index * 2];
    } else {
      return colorsArr[(props.$index - 5) * 2 + 1];
    }
  }};
`;

const TagContainer = styled.div`
  position: relative;
  height: 100%;
`;

const Tag = styled.div`
  position: absolute;
  z-index: 1;
  bottom: -10px;
  left: 0;
  border-radius: 4px;
  padding: 0 3px;
  height: 10px;
  line-height: 10px;
  font-size: 7px;
  color: #fff;
  background: ${(props) => {
    if (props.$index < 5) {
      return colorsArr[props.$index * 2];
    } else {
      return colorsArr[(props.$index - 5) * 2 + 1];
    }
  }};
`;

export default function Cursor(props) {
  const { collabeditor, index, selectionPosition } = props;

  return (
    <Line $index={index} $selectionPosition={selectionPosition}>
      <TagContainer>
        <Tag $index={index}>{collabeditor?.name}</Tag>
      </TagContainer>
    </Line>
  );
}
