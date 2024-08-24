import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/global.css";

import { Auth0Provider } from "@auth0/auth0-react";

// <React.StrictMode><App /></React.StrictMode> causes two renders.
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain="dev-bn8s278zc54ocjvv.us.auth0.com"
    clientId="kl6LAPOx7pSTazNZg07jQcfxiXJIdDED"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);
