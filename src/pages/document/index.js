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
  .ghostContent {
    display: none;
    width: 100%;
    height: 100px;
    border: 1px solid #eee;
    white-space: pre-wrap; // to investigate: break-spaces and pre-wrap work
  }
`

// socket needs to be declared outside of the function
const socket = io(serverUrl, {
  autoConnect: false,
})

// TODO: polish cursor tracking
export default function Document(props) {
  const { user } = useContext(UserContext)

  // document
  const documentFetched = useRef(false)
  const document = useRef({ content: '' })
  const [permissions, setPermissions] = useState(null)

  // content
  const nameRef = useRef()
  const contentRef = useRef()
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
  const ghostContentRef = useRef(null)
  const ghostContentContent = useRef('')

  // everyone's cursors
  const cursorLocations = useRef({})

  // connect to socket.io on load
  useEffect(() => {
    window.scrollTo(0, 0)
    socket.connect()
  }, [])

  const params = useParams()

  // when the user has loaded, fetch the document
  useEffect(() => {
    if (user && !documentFetched.current) {
      fetchDocument(params.id)
    }
    // eslint-disable-next-line
  }, [user])

  useEffect(() => {
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

  const fetchDocument = async (id) => {
    const fetchedDocument = await getDocument(id)

    setPermissions(getPermissions(fetchedDocument, user))

    socket.emit('join', {
      document: fetchedDocument,
      user: user,
    })
  }

  // when anyone joins, update the document
  socket.on('join', (updatedDocument) => {
    document.current = updatedDocument
    if (contentRef.current) {
      contentRef.current.value = updatedDocument?.content
    }
    if (nameRef.current) {
      nameRef.current.value = updatedDocument?.name
    }
    setLiveUsers(updatedDocument.liveUsers)
    setCollabeditors(updatedDocument.collabeditors)
  })

  // when someone leaves, update the live users
  socket.on('leave', (updatedDocument) => {
    document.current = updatedDocument
    setLiveUsers(updatedDocument.liveUsers)
  })

  socket.on('content', (updatedDocument) => {
    document.current = updatedDocument
    if (contentRef.current) {
      contentRef.current.value = updatedDocument.content
    }
  })

  socket.on('name', (updatedDocument) => {
    document.current = updatedDocument
    if (nameRef.current) {
      nameRef.current.value = updatedDocument.name
    }
  })

  socket.on('collabeditors', (updatedDocument) => {
    document.current = updatedDocument
    setCollabeditors(updatedDocument.collabeditors)
  })

  const textareaOnChange = (e) => {
    socket.emit('content', {
      document: document.current,
      content: e.target.value,
      // user: currentUser,
    })

    cursorLocation.current = 'content'
    cursorCharLocation.current = [
      e.target.selectionStart,
      e.target.selectionEnd,
    ]
    // setghostContent();
  }

  // on mouse or key down
  const textareaMouseKeyDown = (e) => {
    dragging.current = true

    cursorLocation.current = 'content'
    cursorCharLocation.current = [
      e.target.selectionStart,
      e.target.selectionEnd,
    ]
    // setghostContent();
    textareaDraggingScrolling(e)
  }

  // dragging or scrolling
  const textareaDraggingScrolling = (e) => {
    cursorLocation.current = 'content'
    cursorCharLocation.current = [
      e.target.selectionStart,
      e.target.selectionEnd,
    ]
    // setghostContent();
    setTimeout(() => {
      if (dragging.current) {
        textareaDraggingScrolling(e)
      }
    }, 100)
  }

  // on mouse or key up
  const textareaMouseKeyUp = (e) => {
    dragging.current = false
    cursorLocation.current = 'content'
    cursorCharLocation.current = [
      e.target.selectionStart,
      e.target.selectionEnd,
    ]
    // setghostContent();
  }

  const setghostContent = () => {
    const content = document.current.content
    if (
      // cursor is at 0
      cursorCharLocation.current[0] === 0 &&
      cursorCharLocation.current[0] === cursorCharLocation.current[1]
    ) {
      ghostContentRef.current.innerHTML = `<span></span>${content}</>`

      setCursor()
    } else if (
      cursorCharLocation.current[0] === cursorCharLocation.current[1]
    ) {
      // cursor is at a single position
      const preCharacter = content.substring(
        0,
        cursorCharLocation.current[0] - 1,
      )
      const character = content.substring(
        cursorCharLocation.current[0] - 1,
        cursorCharLocation.current[0],
      )
      const postCharacter = content.substring(
        cursorCharLocation.current[0],
        content.length,
      )

      ghostContentRef.current.innerHTML = `${preCharacter}<span style="background:red;">${character}</span>${postCharacter}`

      setCursor()
    } else if (
      cursorCharLocation.current[0] === 0 &&
      cursorCharLocation.current[0] !== cursorCharLocation.current[1]
    ) {
      // selection is highlighted from 0 to somewhere
      const textSelection = content.substring(
        0,
        cursorCharLocation.current[1] - 1,
      ) // keyword selection is taken by the cursor selection
      const lastCharacter = content.substring(
        cursorCharLocation.current[1] - 1,
        cursorCharLocation.current[1],
      )
      const postSelection = content.substring(
        cursorCharLocation.current[1],
        content.length,
      )

      ghostContentRef.current.innerHTML = `<span></span>${textSelection}<span style="background:red;">${lastCharacter}</span>${postSelection}`
      setCursor()
    } else {
      // selection is highlighted from somewhere to somewhere
      const preSelection = content.substring(
        0,
        cursorCharLocation.current[0] - 1,
      )
      const firstCharacter = content.substring(
        cursorCharLocation.current[0] - 1,
        cursorCharLocation.current[0],
      )
      const midSelection = content.substring(
        cursorCharLocation.current[0],
        cursorCharLocation.current[1] - 1,
      )
      const lastCharacter = content.substring(
        cursorCharLocation.current[1] - 1,
        cursorCharLocation.current[1],
      )
      const postSelection = content.substring(
        cursorCharLocation.current[1],
        content.length,
      )

      ghostContentRef.current.innerHTML = `${preSelection}<span style="background:red;">${firstCharacter}</span>${midSelection}<span style="background:red;">${lastCharacter}</span>${postSelection}`
      setCursor()
    }
  }

  const setCursor = () => {
    if (ghostContentRef.current.children.length) {
      // set first cursor
      const position1 = [
        ghostContentRef.current.children[0]?.offsetLeft +
          ghostContentRef.current.children[0]?.offsetWidth,
        ghostContentRef.current.children[0]?.offsetTop -
          ghostContentRef.current.offsetTop,
      ]
      let position2
      if (ghostContentRef.current.children.length === 1) {
        // second is same as first
        position2 = [
          ghostContentRef.current.children[0]?.offsetLeft +
            ghostContentRef.current.children[0]?.offsetWidth,
          ghostContentRef.current.children[0]?.offsetTop -
            ghostContentRef.current.offsetTop,
        ]
      } else {
        // range is selected
        position2 = [
          ghostContentRef.current.children[1]?.offsetLeft +
            ghostContentRef.current.children[0]?.offsetWidth,
          ghostContentRef.current.children[1]?.offsetTop -
            ghostContentRef.current.offsetTop,
        ]
      }

      cursorPixelLocation.current = [position1, position2]
    }
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
          <textarea
            onChange={textareaOnChange}
            onMouseDown={textareaMouseKeyDown}
            onMouseUp={textareaMouseKeyUp}
            onKeyDown={(e) => {
              if (
                e.code === 'ArrowUp' ||
                e.code === 'ArrowRight' ||
                e.code === 'ArrowDown' ||
                e.code === 'ArrowLeft'
              ) {
                textareaMouseKeyDown(e)
              }
            }}
            onKeyUp={(e) => {
              if (
                e.code === 'ArrowUp' ||
                e.code === 'ArrowRight' ||
                e.code === 'ArrowDown' ||
                e.code === 'ArrowLeft'
              ) {
                textareaMouseKeyUp(e)
              }
            }}
            ref={contentRef}
            readOnly={permissions === 'view' ? true : false}
          />
          {/* <Cursor
            collabeditor={document.current ? document.current.owner : ""}
            index={1}
            cursorPixelLocation={cursorPixelLocation}
            users={users}
          /> */}
          <div className="ghostContent" ref={ghostContentRef}>
            {ghostContentContent.current}
          </div>
        </Content>
      </Page>
    </>
  )
}
