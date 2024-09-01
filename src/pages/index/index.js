import { useEffect, useState } from "react";

import Header from "./Header";
import DocumentCard from "./DocumentCard";

import { getDocuments } from "../../server/documents";

export default function Home(props) {
  const { users, setUsers, currentUser, setCurrentUser } = props;

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (currentUser) {
      getDocuments(currentUser._id).then((results) => {
        setDocuments(results);
      });
    }
  }, [currentUser]);

  return (
    <>
      <Header
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        users={users}
        setUsers={setUsers}
      />
      {documents?.map((document, i) => (
        <DocumentCard
          document={document}
          key={`document-${i}`}
          documents={documents}
          setDocuments={setDocuments}
          users={users}
          currentUser={currentUser}
        />
      ))}
    </>
  );
}
