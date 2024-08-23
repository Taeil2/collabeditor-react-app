import { useEffect, useState, useRef } from "react";

import Header from "./Header";
import DocumentCard from "./DocumentCard";

import { getUser, addUser } from "../../server/users";
import { getDocuments } from "../../server/documents";

import { useAuth0 } from "@auth0/auth0-react";

// if user has no name, show name modal

export default function Home(props) {
  const { users, setUsers } = props;

  const [currentUser, setCurrentUser] = useState(null);
  const [documents, setDocuments] = useState([]);

  const { user } = useAuth0();

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser && users) {
      // if there is no current user, set the current user
      const matchedUser = users.filter((u) => u.email === user.email);
      if (matchedUser.length) {
        setCurrentUser(matchedUser[0]);
      } else {
        createNewUser();
      }
    }
    // eslint-disable-next-line
  }, []);

  const createNewUser = async () => {
    if (user.given_name) {
      const newUser = await addUser(user.email, user.given_name);
      setCurrentUser(newUser);
    } else {
      const newUser = await addUser(user.email, "");
      setCurrentUser(newUser);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getDocuments(currentUser._id).then((results) => {
        setDocuments(results);
      });
    }
  }, [currentUser]);

  console.log(documents);

  return (
    <>
      <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
      {documents?.map((document, i) => (
        <DocumentCard
          document={document}
          key={`document-${i}`}
          documents={documents}
          setDocuments={setDocuments}
        />
      ))}
    </>
  );
}
