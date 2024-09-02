import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import styled from 'styled-components'

import Home from './pages/index'
import Document from './pages/document'

import GlobalStyles from './styles/global'

const Loading = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`

export default function App() {
  const { isAuthenticated } = useAuth0()

  return (
    <GlobalStyles>
      <main>
        {!isAuthenticated && <Loading>Loading</Loading>}
        {isAuthenticated && (
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="document/:id" element={<Document />} />
            </Routes>
          </BrowserRouter>
        )}
      </main>
    </GlobalStyles>
  )
}
