import styled from 'styled-components'
import { useContext, useState } from 'react'
import { colors } from '../../styles/styles'

import { UserContext } from '../../contexts/UserContext'

import { Link } from 'react-router-dom'

import Button from '../../components/Button'
import Collabeditor from '../../components/Collabeditor'
import CollabeditorsModal from './CollabeditorsModal'
import { IoIosArrowBack } from 'react-icons/io'
import { IoPeople } from 'react-icons/io5'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  > div:first-of-type {
    flex: 1;
    margin-right: 20px;
    margin-bottom: 30px;
    a {
      color: ${colors.blue};
    }
    input {
      margin-top: 8px;
      display: block;
      width: 100%;
      background: transparent;
      border: 0;
      font-family: 'Open Sans', Arial, Helvetica, sans-serif;
      font-size: 32px;
      height: 41px; // it was cutting off descenders
      // cursor: text !important;
    }
  }
  > div:last-of-type {
    margin-top: 32px;
  }
`

export default function Header(props) {
  const { document, liveUsers, collabeditors, nameRef, socket, permissions } =
    props

  const { users } = useContext(UserContext)

  const [collabeditorsOpen, setCollabeditorsOpen] = useState(false)

  const changeName = (e) => {
    socket.emit('name', {
      document: document.current,
      name: e.target.value,
    })
  }

  return (
    <Container>
      <div>
        <Link to="/">
          <IoIosArrowBack /> back to documents
        </Link>
        <input
          type="text"
          placeholder="Document Name"
          onChange={changeName}
          ref={nameRef}
          readOnly={permissions === 'view' ? true : false}
        />
        {/* <div className="ghostName" ref={ghostNameRef}>
          {ghostNameContent}
        </div> */}
      </div>
      <div>
        {Object.keys(liveUsers).map((key, i) => {
          const userId = liveUsers[key].userId
          return (
            <Collabeditor
              collabeditor={userId}
              users={users}
              index={i}
              isOwner={document.current.owner === userId ? true : false}
              key={`collabeditor-${i}`}
            />
          )
        })}
        {/* <Collabeditor
          collabeditor={document?.owner}
          users={users}
          index={0}
          key={`collabeditor-0`}
        /> */}
        <Button
          icon={<IoPeople />}
          text="collabeditors"
          onClick={() => {
            setCollabeditorsOpen(true)
          }}
        />
        {collabeditorsOpen && (
          <CollabeditorsModal
            document={document}
            collabeditors={collabeditors}
            setShowModal={setCollabeditorsOpen}
            socket={socket}
            permissions={permissions}
          />
        )}
      </div>
    </Container>
  )
}
