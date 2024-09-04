const socketListeners = (
  socket,
  contentRef,
  nameRef,
  setLiveUsers,
  setCollabeditors,
) => {
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
}

export default socketListeners
