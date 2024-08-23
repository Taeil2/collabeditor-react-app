import serverUrl from "./serverUrl";

const getDocuments = async (userId) => {
  let results = await fetch(`${serverUrl}/documents?id=${userId}`).then(
    (resp) => resp.json()
  );
  return results;
};

const addDocument = async (userId, userName) => {
  let response = await fetch(`${serverUrl}/documents`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: userId,
      name: userName,
    }),
  }).then((resp) => resp.json());

  return response;
};

const deleteDocument = async (id) => {
  await fetch(`${serverUrl}/documents/${id}`, {
    method: "DELETE",
  });
};

export { getDocuments, addDocument, deleteDocument };
