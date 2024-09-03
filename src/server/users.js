import serverUrl from './serverUrl'

const getUsers = async () => {
  let results = await fetch(`${serverUrl}/users`).then((resp) => resp.json())
  return results
}

const getUser = async (emailAddress) => {
  let result = await fetch(
    `${serverUrl}/users/user?email=${emailAddress}`,
  ).then((resp) => resp.json())

  return result
}

const addUser = async (email, name) => {
  let response = await fetch(`${serverUrl}/users`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email,
      name,
    }),
  }).then((resp) => resp.json())

  return response
}

const updateUser = async (name, userId) => {
  let response = await fetch(`${serverUrl}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      name,
    }),
  }).then((resp) => resp.json())

  return response
}

export { getUsers, getUser, addUser, updateUser }
