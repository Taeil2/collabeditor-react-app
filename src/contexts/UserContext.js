import { createContext, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import { getUsers, addUser } from '../server/users'

const UserContext = createContext()

const UserProvider = ({ children }) => {
  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading,
    user: auth0User,
  } = useAuth0()

  const [user, setUser] = useState()
  const [users, setUsers] = useState()

  // fetch the users (can begin fetching before authentication is checked)
  useEffect(() => {
    fetchUsers()
  }, [])

  // redirect to login if user is not authenticated
  useEffect(() => {
    // if loading is done and user is not authenticated, user is not authenticated
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect()
    }
  }, [isLoading])

  const fetchUsers = async () => {
    const fetchedUsers = await getUsers()
    setUsers(fetchedUsers)
  }

  useEffect(() => {
    // if there is no current user, set the current user
    if (!user) {
      if (users && auth0User) {
        const matchedUser = users.filter((u) => u.email === auth0User.email)
        if (matchedUser.length) {
          setUser(matchedUser[0])
        } else {
          // otherwise, create a new user
          createNewUser()
        }
      }
    }
  }, [users, auth0User]) // upon fetching all users and the auth0 user

  const createNewUser = async () => {
    if (auth0User.given_name) {
      const newUser = await addUser(auth0User.email, auth0User.given_name)
      setUser({
        _id: newUser.insertedId,
        email: auth0User.email,
        name: auth0User.given_name,
      })
    } else {
      const newUser = await addUser(auth0User.email, '')
      setUser({
        _id: newUser.insertedId,
        email: auth0User.email,
        name: '',
      })
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        users,
        setUsers,
        fetchUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider }
