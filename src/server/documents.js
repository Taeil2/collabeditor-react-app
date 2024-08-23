import serverUrl from "./serverUrl";

const getDocuments = async (userId) => {
  let results = await fetch(`${serverUrl}/documents?id=${userId}`).then(
    (resp) => resp.json()
  );
  return results;
};

const addDocument = async (userId) => {
  let response = await fetch(`${serverUrl}/documents`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: userId,
    }),
  }).then((resp) => resp.json());

  return response;
};

const updateDocument = async (updates) => {
  //   let response = await fetch(`${serverUrl}/document/${id}`, {
  //     method: "PATCH",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify(updates),
  //   }).then((resp) => resp.json());
  //   return response;
};

const deleteDocument = async (id) => {
  await fetch(`${serverUrl}/documents/${id}`, {
    method: "DELETE",
  });
};

export { getDocuments, addDocument, updateDocument, deleteDocument };
