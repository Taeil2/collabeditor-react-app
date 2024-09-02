import serverUrl from './serverUrl'

const getDocuments = async (userId) => {
  let results = await fetch(`${serverUrl}/documents?id=${userId}`).then(
    (resp) => resp.json(),
  )

  return results
}

const addDocument = async (userId) => {
  let response = await fetch(`${serverUrl}/documents`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      id: userId,
    }),
  }).then((resp) => resp.json())

  return response
}

const getDocument = async (documentId) => {
  let result = await fetch(`${serverUrl}/documents/${documentId}`).then(
    (resp) => resp.json(),
  )

  return result
}

const updateDocument = async (update, id) => {
  let response = await fetch(`${serverUrl}/documents/${id}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(update),
  }).then((resp) => resp.json())

  return response
}

const deleteDocument = async (id) => {
  await fetch(`${serverUrl}/documents/${id}`, {
    method: 'DELETE',
  })
}

export {
  getDocuments,
  addDocument,
  getDocument,
  updateDocument,
  deleteDocument,
}
