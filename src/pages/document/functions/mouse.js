// on mouse or key down
const onMouseUp = (e, dragging) => {
  dragging.current = true

  // cursorLocation.current = 'content'
  // cursorCharLocation.current = [e.target.selectionStart, e.target.selectionEnd]
  // draggingOrScrolling(e, dragging, cursorLocation, cursorCharLocation)
}

// dragging or scrolling
const onMouseDown = (e, dragging) => {
  // cursorLocation.current = 'content'
  // cursorCharLocation.current = [e.target.selectionStart, e.target.selectionEnd]
  setTimeout(() => {
    if (dragging.current) {
      draggingOrScrolling(e, dragging)
    }
  }, 100)
}

// dragging or scrolling
const draggingOrScrolling = (e, dragging) => {
  // cursorLocation.current = 'content'
  // cursorCharLocation.current = [e.target.selectionStart, e.target.selectionEnd]
  setTimeout(() => {
    if (dragging.current) {
      draggingOrScrolling(e, dragging)
    }
  }, 100)
}

// on mouse or key up
const onMouseOrKeyUp = (e, dragging) => {
  dragging.current = false
  // cursorLocation.current = 'content'
  // cursorCharLocation.current = [e.target.selectionStart, e.target.selectionEnd]
}

export { onMouseUp, onMouseDown, draggingOrScrolling, onMouseOrKeyUp }
