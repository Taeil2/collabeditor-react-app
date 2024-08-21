import { useState, createContext } from 'react'

const UserContext = createContext()

export default function UserProvider({ children }) {
  const [users, setUsers] = useState()
  const [user, setUser] = useState()

  const value = { users, setUsers, user, setUser }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
