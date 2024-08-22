import styled from "styled-components";
import { grays } from "../../styles/styles";

import { Link } from "react-router-dom";

import Collabeditor from "../../components/Collabeditor";
import Button from "../../components/Button";

import { FaRegTrashAlt } from "react-icons/fa";

const Card = styled.div`
  display: grid;
  grid-template-columns: auto 161px 111px;
  column-gap: 20px;
  border-radius: 5px;
  border: 1px solid ${grays.gray4};
  padding: 20px;
  padding-top: 9px;
  background: #fff;
  margin-bottom: 30px;
  cursor: pointer;
  > div:first-of-type {
    p {
      max-height: 100px;
      overflow: hidden;
      --max-lines: 5
      color: ${grays.gray6};
    }
  }
  > div:not(:first-of-type) {
    padding-top: 24px;
    h6 {
      margin-bottom: 10px;
    }
  }
  > div:last-of-type {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 16px;
      color: ${grays.gray5};
      margin-top: -5px;
    }
    button {
      align-self: end;
    }
  }
`;

export default function DocumentCard(props) {
  const { document } = props;

  const date = new Date(document.updated);
  const hours = date.getHours() % 12;
  let ampm = "am";
  if (hours > 12) {
    ampm = "pm";
  }
  const dateString = (
    <span>
      {date.getMonth()}/{date.getDate()}
      &nbsp;&nbsp;
      {hours}:{date.getMinutes()}
      {ampm}
    </span>
  );

  // TODO: truncate document content with ellipsis
  console.log(document);
  return (
    <Link to={`/document/${document?._id}`}>
      <Card>
        <div>
          <h3>{document?.name}</h3>
          <p>{document?.content}</p>
        </div>
        <div>
          <h6>collabeditors</h6>
          <Collabeditor collabeditor={document?.owner} index={0} />
          {document?.collabeditors.map((collabeditor, i) => (
            <Collabeditor
              collabeditor={collabeditor}
              index={i + 1}
              key={`collabeditor-${i + 1}`}
            />
          ))}
        </div>
        <div>
          <div>
            <h6>updated</h6>
            <p>{dateString}</p>
          </div>
          <Button
            icon={<FaRegTrashAlt />}
            onClick={() => {
              console.log("clicked");
            }}
            color="red"
          />
        </div>
      </Card>
    </Link>
  );
}
