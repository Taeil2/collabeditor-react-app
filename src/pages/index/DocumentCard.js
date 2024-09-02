import { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { grays } from '../../styles/styles'

import { Link } from 'react-router-dom'

import Collabeditor from '../../components/Collabeditor'
import Button from '../../components/Button'

import { FaRegTrashAlt } from 'react-icons/fa'

import { deleteDocument } from '../../server/documents'
import { getPermissions } from '../../utils'
import { UserContext } from '../../contexts/UserContext'

const Container = styled.div`
  width: 100%;
  & > a {
    display: flex !important;
  }
`

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
  width: 100%;
  > div:first-of-type {
    h3 {
      color: ${grays.gray8};
    }
    p {
      color: ${grays.gray6};
      max-height: 100px;
      overflow: hidden;
      --max-lines: 5 white-space: pre-line;
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
      margin-top: 20px;
    }
  }
`

export default function DocumentCard(props) {
  const { document, documents, setDocuments } = props

  const { user } = useContext(UserContext)

  const [permissions, setPermissions] = useState(null)

  useEffect(() => {
    setPermissions(getPermissions(document, user))
    // eslint-disable-next-line
  }, [])

  const date = new Date(document.updated)

  let hours = date.getHours() % 12
  let ampm = 'am'
  if (hours > 12) {
    ampm = 'pm'
  }
  if (hours === 0) {
    hours = 12
  }

  let minutes = date.getMinutes()
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  const dateString = (
    <span>
      {date.getMonth()}/{date.getDate()}
      &nbsp;&nbsp;
      {hours}:{minutes}
      {ampm}
    </span>
  )

  // TODO: truncate document content with ellipsis
  return (
    <Container>
      <Link to={`/document/${document?._id}`}>
        <Card>
          <div>
            <h3>{document?.name ? document.name : 'Unnamed Document'}</h3>
            <p>{document?.content}</p>
            {/* <div>{document?.content}</div> */}
          </div>
          <div>
            <h6>collabeditors</h6>
            <Collabeditor
              collabeditor={document?.owner}
              isOwner={true}
              index={0}
            />
            {document?.collabeditors.map((collabeditor, i) => (
              <Collabeditor
                collabeditor={collabeditor.id}
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
            {(permissions === 'owner' || permissions === 'all') && (
              <Button
                icon={<FaRegTrashAlt />}
                onClick={(e) => {
                  e.preventDefault()
                  deleteDocument(document?._id)
                  let documentsList = documents.filter(
                    (d) => d._id !== document?._id,
                  )
                  setDocuments(documentsList)
                }}
                color="red"
              />
            )}
          </div>
        </Card>
      </Link>
    </Container>
  )
}
