import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import GlobalStyles from "./styles/global";
import Home from "./pages/index";
import Document from "./pages/document";

import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";

import { getUsers } from "./server/users";

const Loading = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  return (
    <GlobalStyles>
      <main>
        {/* <RouterProvider router={router}></RouterProvider> */}
        {isAuthenticated && (
          <BrowserRouter basename="/">
            <Routes>
              <Route
                path="/"
                element={<Home users={users} setUsers={setUsers} />}
              />
              <Route
                path="document/:id"
                element={<Document users={users} setUsers={setUsers} />}
              />
            </Routes>
          </BrowserRouter>
        )}
        {!isLoading && !isAuthenticated && (
          <div>
            <LoginButton />
          </div>
        )}
        {isLoading && !isAuthenticated && (
          <div>
            <Loading>Loading</Loading>
            <LoginButton />
          </div>
        )}
        {isLoading && isAuthenticated && (
          <div>
            <Loading>Loading</Loading>
            <LogoutButton />
          </div>
        )}
      </main>
    </GlobalStyles>
  );
}
