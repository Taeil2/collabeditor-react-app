import Header from "./Header";
import DocumentCard from "./DocumentCard";

import sampleDocuments from "../../sampleDocuments";

export default function Home() {
  return (
    <>
      <Header />
      {sampleDocuments.map((document, i) => (
        <DocumentCard document={document} key={`document-${i}`} />
      ))}
    </>
  );
}
