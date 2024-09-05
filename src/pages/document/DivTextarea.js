import { useRef, useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import Header from './Header'
import Cursor from './Cursor'

import { getDocument } from '../../server/documents'

import { io } from 'socket.io-client'
import serverUrl from '../../server/serverUrl'
import { getPermissions } from '../../utils'

import { UserContext } from '../../contexts/UserContext'

import { onMouseUp, onMouseDown, onMouseOrKeyUp } from './functions/mouse'
import socketListeners from './functions/socketListeners'

const Page = styled.div`
  width: 100%;
  background: #fff;
  // height: 1294px
  min-height: 1294.11765px; // 11 inch height: 1000px / 8.5 * 11 (for an 8.5x11 ratio)
  padding: 117.647059px; // 1 inch margins: 1 / 8.5 * 1000px
`

const Content = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  textarea {
    width: 100%;
    height: 1058.82353px; // 9 inch height: 1000px / 8.5 * 9
    // height: 100px;
    resize: none;
    border: 0;
    border: 1px solid #eee;
    font-family: 'Noto Sans', Arial, Helvetica, sans-serif;
    font-size: 14px;
    // to hide cursor and replace with custom ones
    // caret-color: transparent;
  }
`

const CustomTextarea = styled.div`
  height: 1058.82353px; // 9 inch height: 1000px / 8.5 * 9
  // height: 100px;
  border: 1px solid #eee;
  font-family: 'Noto Sans', Arial, Helvetica, sans-serif;
  font-size: 14px;
  cursor: text;
`

// socket needs to be declared outside of the function
const socket = io(serverUrl, {
  autoConnect: false,
})

export default function DivTextarea(props) {
  const { user, users } = useContext(UserContext)

  const documentFetched = useRef(false)
  const [document, setDocument] = useState({ _id: '', content: '' })
  const [permissions, setPermissions] = useState(null)
  const dragging = useRef(false)

  console.log(document)

  // scroll to top and connect to socket.io on load
  useEffect(() => {
    window.scrollTo(0, 0)

    socket.connect()

    // use join event instead of connect, because document is not gathered yet.
    // socket.on("connect", () => {
    //   console.log("on connect");
    // });

    // on disconnect, leave the socket.io room
    return () => {
      socket.emit('leave', {
        document: document,
        user: user,
      })
    }
    // eslint-disable-next-line
  }, [])
  socketListeners(socket, document, setDocument)

  // when the user has loaded, fetch the document
  const params = useParams()
  useEffect(() => {
    if (user && !documentFetched.current) {
      fetchDocument(params._id)
    }
    // eslint-disable-next-line
  }, [user])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        [
          'Tab',
          'CapsLock',
          'Shift',
          'Control',
          'Alt',
          'Meta',
          'Escape',
        ].includes(e.key)
      ) {
        // ignore
      } else if (
        [
          'F1',
          'F2',
          'F3',
          'F4',
          'F5',
          'F6',
          'F7',
          'F8',
          'F9',
          'F10',
          'F11',
          'F12',
        ].includes(e.key)
      ) {
        // ignore F keys
      } else if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft'
      ) {
        // onMouseOrKeyUp(e)
      } else if (e.key === 'Backspace') {
        // remove a character
      } else if (e.key === 'Enter') {
        // add a return
      } else {
        // normal key
      }
      console.log(e.key)

      // socket.emit('content', {
      //   document: document,
      //   content: "e.target.value",
      // })
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const fetchDocument = async (_id) => {
    const fetchedDocument = await getDocument(_id)

    setPermissions(getPermissions(fetchedDocument, user))

    socket.emit('join', {
      document: fetchedDocument,
      user: user,
    })
  }

  return (
    <>
      <Header
        document={document}
        socket={socket}
        // permissions={permissions}
      />
      <Page>
        <Content>
          <CustomTextarea
            // onChange={textareaOnChange}
            onMouseDown={(e) => {
              onMouseDown(e, dragging)
            }}
            onMouseUp={(e) => {
              onMouseUp(e, dragging)
            }}
            onCopy={(e) => {
              console.log('onCopy', e)
            }}
            onPaste={(e) => {
              console.log('onPaste', e)
            }}
            readOnly={permissions === 'view' ? true : false}
          >
            {document.content.split('').map((letter, i) => (
              <span
                onClick={(e) => {
                  console.log(e)
                }}
                key={i}
              >
                {letter}
              </span>
            ))}
          </CustomTextarea>
          {/* <Cursor
            collabeditor={document.current ? document.current.owner : ''}
            index={1}
            cursorPixelLocation={cursorPixelLocation}
            users={users}
          /> */}
        </Content>
      </Page>
    </>
  )
}
