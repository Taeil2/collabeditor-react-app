import { useEffect, useState, useContext } from 'react'

import Header from './Header'
import DocumentCard from './DocumentCard'

import { getDocuments } from '../../server/documents'
import { UserContext } from '../../contexts/UserContext'

export default function Home(props) {
  const [documents, setDocuments] = useState([])
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user) {
      getDocuments(user._id).then((results) => {
        setDocuments(results)
      })
    }
  }, [user])

  return (
    <>
      <Header />
      {documents?.map((document, i) => (
        <DocumentCard
          document={document}
          key={`document-${i}`}
          documents={documents}
          setDocuments={setDocuments}
        />
      ))}
    </>
  )
}
