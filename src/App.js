import { useState, useEffect } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import GlobalStyles from "./styles/global";
// import AuthenticationHandler from "./_app/AuthenticationHandler";
import styled from "styled-components";

import Home from "./pages/index";
import Document from "./pages/document";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Loading = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "document",
    element: <Document />,
  },
]);

export default function App() {
  let [location, setLocation] = useState("http://www.localhost:3000/");
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocation(window.location.origin);
    }

    // fetch users
    // logged in user is not in users, create a new user
  }, []);

  {
    /* <img src={user.picture} alt={user.name} />
       <h2>{user.name}</h2>
       <p>{user.email}</p> */
  }

  // console.log("isLoading", isLoading);
  // console.log("isAuthenticated", isAuthenticated);
  // console.log("user", user);

  return (
    <Auth0Provider
      domain="dev-bn8s278zc54ocjvv.us.auth0.com"
      clientId="kl6LAPOx7pSTazNZg07jQcfxiXJIdDED"
      authorizationParams={{
        redirect_uri: location,
      }}
    >
      <GlobalStyles>
        <main>
          <RouterProvider router={router}></RouterProvider>
          {/* {isLoading && (
            <div>
              <Loading>Loading</Loading>
              <LoginButton />
              <LogoutButton />
            </div>
          )} */}
          {/* {isAuthenticated && <RouterProvider router={router}></RouterProvider>} */}
          {/* {!isLoading && !isAuthenticated && (
            <div>
              <LoginButton />
              <LogoutButton />
            </div>
          )} */}
        </main>
      </GlobalStyles>
    </Auth0Provider>
  );
}
