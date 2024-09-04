// on mouse or key down
const onMouseUp = (e, dragging, cursorLocation, cursorCharLocation) => {
  dragging.current = true

  cursorLocation.current = 'content'
  cursorCharLocation.current = [e.target.selectionStart, e.target.selectionEnd]
  draggingOrScrolling(e, dragging, cursorLocation, cursorCharLocation)
}

// dragging or scrolling
const onMouseDown = (
  e,
  setContentFocused,
  dragging,
  cursorLocation,
  cursorCharLocation,
) => {
  setContentFocused(true)

  cursorLocation.current = 'content'
  cursorCharLocation.current = [e.target.selectionStart, e.target.selectionEnd]
  setTimeout(() => {
    if (dragging.current) {
      draggingOrScrolling(e, dragging, cursorLocation, cursorCharLocation)
    }
  }, 100)
}

// dragging or scrolling
const draggingOrScrolling = (
  e,
  dragging,
  cursorLocation,
  cursorCharLocation,
) => {
  cursorLocation.current = 'content'
  cursorCharLocation.current = [e.target.selectionStart, e.target.selectionEnd]
  setTimeout(() => {
    if (dragging.current) {
      draggingOrScrolling(e, dragging, cursorLocation, cursorCharLocation)
    }
  }, 100)
}

// on mouse or key up
const onMouseOrKeyUp = (e, dragging, cursorLocation, cursorCharLocation) => {
  dragging.current = false
  cursorLocation.current = 'content'
  cursorCharLocation.current = [e.target.selectionStart, e.target.selectionEnd]
}

export { onMouseUp, onMouseDown, draggingOrScrolling, onMouseOrKeyUp }
