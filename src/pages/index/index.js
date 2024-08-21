import { useEffect, useState } from "react";

import Header from "./Header";
import DocumentCard from "./DocumentCard";

import sampleDocuments from "../../sampleDocuments";

// if user has no name, show name modal

export default function Home() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (false) {
      // if user has no name, show name modal
    } else {
      fetch(`http://localhost:5050/documents/`)
        .then((resp) => resp.json())
        .then((json) => {
          setDocuments(json);
        });
    }
  }, []);

  return (
    <>
      <Header />
      {documents.map((document, i) => (
        <DocumentCard document={document} key={`document-${i}`} />
      ))}
      {/* {sampleDocuments.map((document, i) => (
        <DocumentCard document={document} key={`document-${i}`} />
      ))} */}
    </>
  );
}
