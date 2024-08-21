import Header from "./Header";
import DocumentCard from "./DocumentCard";

import LoginButton from "../../components/LoginButton";

import sampleDocuments from "../../sampleDocuments";

export default function Home() {
  return (
    <>
      <LoginButton />
      <Header />
      {sampleDocuments.map((document, i) => (
        <DocumentCard document={document} key={`document-${i}`} />
      ))}
    </>
  );
}
