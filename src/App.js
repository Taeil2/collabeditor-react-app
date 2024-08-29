import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import GlobalStyles from "./styles/global";
import Home from "./pages/index";
import Document from "./pages/document";

import { getUsers, addUser } from "./server/users";

const Loading = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export default function App() {
  const { isAuthenticated, loginWithRedirect, isLoading, user } = useAuth0();

  const [users, setUsers] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // fetch the users (can begin fetching before authentication is checked)
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  // redirect to login if user is not authenticated
  useEffect(() => {
    // if loading is done and user is not authenticated, user is not authenticated
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading]);

  useEffect(() => {
    // if there is no current user, set the current user
    if (!currentUser) {
      if (users && user) {
        const matchedUser = users.filter((u) => u.email === user.email);
        if (matchedUser.length) {
          setCurrentUser(matchedUser[0]);
        } else {
          // otherwise, create a new user
          createNewUser();
        }
      }
    }
  }, [users, user]);

  const createNewUser = async () => {
    if (user.given_name) {
      const newUser = await addUser(user.email, user.given_name);
      setCurrentUser({
        _id: newUser.insertedId,
        email: user.email,
        name: user.given_name,
      });
    } else {
      const newUser = await addUser(user.email, "");
      setCurrentUser({
        _id: newUser.insertedId,
        email: user.email,
        name: "",
      });
    }
  };

  return (
    <GlobalStyles>
      <main>
        {!isAuthenticated && <Loading>Loading</Loading>}
        {isAuthenticated && (
          <BrowserRouter basename="/">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    users={users}
                    setUsers={setUsers}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                  />
                }
              />
              <Route
                path="document/:id"
                element={
                  <Document
                    users={users}
                    setUsers={setUsers}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        )}
      </main>
    </GlobalStyles>
  );
}
