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

import {
  onMouseUp,
  onMouseDown,
  draggingOrScrolling,
  onMouseOrKeyUp,
} from './functions/mouse'
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
`

// socket needs to be declared outside of the function
const socket = io(serverUrl, {
  autoConnect: false,
})

export default function DivTextarea(props) {
  const { user, users } = useContext(UserContext)

  // document
  const documentFetched = useRef(false)
  const document = useRef({ content: '' })
  const [permissions, setPermissions] = useState(null)

  // content
  const nameRef = useRef()
  const contentRef = useRef()
  const [content, setContent] = useState('')
  // const content = useRef(<>Hi</>)
  const [contentFocused, setContentFocused] = useState(true)
  const [liveUsers, setLiveUsers] = useState({})
  const [collabeditors, setCollabeditors] = useState([])

  // track own cursor
  const cursorLocation = useRef('header')
  const cursorCharLocation = useRef([0, 0])
  const cursorPixelLocation = useRef([
    [1, 1],
    [1, 1],
  ])
  const dragging = useRef(false)

  // everyone's cursors
  const cursorLocations = useRef({})

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
        document: document.current,
        user: user,
      })
    }
    // eslint-disable-next-line
  }, [])
  socketListeners(socket, contentRef, nameRef, setLiveUsers, setCollabeditors)

  // when the user has loaded, fetch the document
  const params = useParams()
  useEffect(() => {
    if (user && !documentFetched.current) {
      fetchDocument(params._id)
    }
    // eslint-disable-next-line
  }, [user])

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (contentFocused) {
        if (
          e.code === 'ArrowUp' ||
          e.code === 'ArrowRight' ||
          e.code === 'ArrowDown' ||
          e.code === 'ArrowLeft'
        ) {
          onArrowDown(e)
        } else {
          onKeyDown(e)
        }
      }
    })
    window.addEventListener('keyup', (e) => {
      if (contentFocused) {
        if (
          e.code === 'ArrowUp' ||
          e.code === 'ArrowRight' ||
          e.code === 'ArrowDown' ||
          e.code === 'ArrowLeft'
        ) {
          onMouseOrKeyUp(e)
        }
      }
    })
  }, [])

  const onArrowDown = (e) => {
    // do this later
    cursorLocation.current = 'content'
    cursorCharLocation.current = [
      e.target.selectionStart,
      e.target.selectionEnd,
    ]
  }

  const onKeyDown = (e) => {
    // socket.emit('content', {
    //   document: document.current,
    //   content: e.target.value,
    //   // user: currentUser,
    // })

    // let pastContent = content
    // console.log(content)
    setContent(content + e.key)
    // setContent("test" += e.key)
    // content.current += e.key
    // contentRef.current.value = content.current

    cursorLocation.current = 'content'
    cursorCharLocation.current = [
      e.target.selectionStart,
      e.target.selectionEnd,
    ]
  }

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
        nameRef={nameRef}
        socket={socket}
        collabeditors={collabeditors}
        setCollabeditors={setCollabeditors}
        permissions={permissions}
        liveUsers={liveUsers}
      />
      <Page>
        <Content>
          <CustomTextarea
            ref={contentRef}
            // onChange={textareaOnChange}
            onMouseDown={(e) => {
              onMouseDown(
                e,
                setContentFocused,
                dragging,
                cursorLocation,
                cursorCharLocation,
              )
            }}
            onMouseUp={(e) => {
              onMouseUp(e, dragging, cursorLocation, cursorCharLocation)
            }}
            onCopy={(e) => {
              console.log('onCopy', e)
            }}
            onPaste={(e) => {
              console.log('onPaste', e)
            }}
            // ref={contentRef}
            readOnly={permissions === 'view' ? true : false}
          >
            {content}
          </CustomTextarea>
          <textarea
            ref={contentRef}
            // onChange={textareaOnChange}
            onMouseDown={(e) => {
              onMouseDown(
                e,
                setContentFocused,
                dragging,
                cursorLocation,
                cursorCharLocation,
              )
            }}
            onMouseUp={(e) => {
              onMouseUp(e, dragging, cursorLocation, cursorCharLocation)
            }}
            onCopy={(e) => {
              console.log('onCopy', e)
            }}
            onPaste={(e) => {
              console.log('onPaste', e)
            }}
            // ref={contentRef}
            readOnly={permissions === 'view' ? true : false}
            value={content}
          />
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
