import styled from 'styled-components'
import { useState, useEffect, useContext, createContext } from 'react'

import LoginButton from '@/components/LoginButton'
import { useAuth0 } from '@auth0/auth0-react'
import Header from '../index/Header'
import LogoutButton from '@/components/LogoutButton'

const Loading = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`

export default function AuthenticationHandler({ Component, pageProps }) {
  const [currentUser, setCurrentUser] = useState()
  const { user, isAuthenticated, isLoading } = useAuth0()

  // const UserContext = useContext()

  // useEffect(() => {
  //   await fetch(serverUrl)
  // }, [])

  // if (isAuthenticated) {
  //   console.log(user)
  // }

  // fix this later
  return (
    <>
      <Component {...pageProps} />
    </>
  )

  if (isLoading) {
    return (
      <div>
        <Loading>Loading</Loading>
        <LoginButton />
        <LogoutButton />
      </div>
    )
  } else if (isAuthenticated) {
    return (
      <UserContext.Provider>
        <Component {...pageProps} />
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </UserContext.Provider>
    )
  } else {
    return (
      <div>
        <LoginButton />
        <LogoutButton />
      </div>
    )
  }
}
