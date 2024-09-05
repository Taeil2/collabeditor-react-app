const socketListeners = (socket, document, setDocument) => {
  // when anyone joins, update the document
  socket.on('join', (updatedDocument) => {
    setDocument(updatedDocument)
  })

  // when someone leaves, update the live users
  socket.on('leave', (updatedDocument) => {
    setDocument(updatedDocument)
  })

  socket.on('content', (updatedDocument) => {
    setDocument(updatedDocument)
  })

  socket.on('name', (updatedDocument) => {
    setDocument(updatedDocument)
  })

  socket.on('collabeditors', (updatedDocument) => {
    setDocument(updatedDocument)
  })
}

export default socketListeners
