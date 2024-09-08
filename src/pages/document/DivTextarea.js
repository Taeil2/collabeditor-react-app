import { useRef, useState, useEffect, useContext, useCallback } from 'react'
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

  // console.log('document', document)
  // console.log('user', user)

  const onKeyDown = useCallback(
    (e) => {
      let updatedDocument
      // if key is to be ignored, just return
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
        return
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
      } else {
        // otherwise...
        updatedDocument = {
          ...document,
        }
        if (
          e.key === 'ArrowUp' ||
          e.key === 'ArrowRight' ||
          e.key === 'ArrowDown' ||
          e.key === 'ArrowLeft'
        ) {
          // if (
          //   e.altKey
          //   e.ctrlKey
          //   e.metaKey
          //   e.shiftKey {
          //     // to do later
          //   }
          // onMouseOrKeyUp(e)
          updatedDocument.liveUsers[socket.id] = {
            cursorIndex: [
              document.liveUsers[socket.id] - 1,
              document.liveUsers[socket.id] - 1,
            ],
            cursorLocation: 'content',
            userId: user._id, // same
          }
        } else if (e.key === 'Backspace') {
          if (e.metaKey) {
            // delete entire line
          } else if (e.altKey) {
            // delete last word
          } else {
            updatedDocument.content = document.content.slice(0, -1)
          }
        } else if (e.key === 'Enter') {
          // add a return
          updatedDocument.content += '\n'
        } else if (e.key === ' ') {
          e.preventDefault()
          updatedDocument.content += e.key
        } else {
          // normal key
          updatedDocument.content += e.key
        }
        socket.emit('edit', updatedDocument)
      }
    },
    [document, user],
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown])

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
            onClick={(e) => {
              if (!e.target.matches('span')) {
                // console.log(document, user)
                const updatedDocument = {
                  ...document,
                }
                updatedDocument.liveUsers[socket.id] = {
                  cursorIndex: [
                    document.content.length,
                    document.content.length,
                  ],
                  cursorLocation: 'content',
                  userId: user.id, // same
                }
                socket.emit('edit', updatedDocument)
              }
            }}
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
          <Cursor
            collabeditor={document.current ? document.current.owner : ''}
            index={1}
            cursorPixelLocation={cursorPixelLocation}
            users={users}
          />
        </Content>
      </Page>
    </>
  )
}
