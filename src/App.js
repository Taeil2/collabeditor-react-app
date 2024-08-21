import { useState, useEffect } from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import GlobalStyles from "./styles/global";
// import AuthenticationHandler from "./_app/AuthenticationHandler";

import Home from "./pages/index";
import Document from "./pages/document";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocation(window.location.origin);
    }
  }, []);

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
          <RouterProvider router={router}></RouterProvider>;
        </main>
      </GlobalStyles>
    </Auth0Provider>
  );
}
