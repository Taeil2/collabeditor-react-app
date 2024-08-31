const getPermissions = (document, user) => {
  if (document.owner === user._id) {
    return "owner";
  } else {
    let permissions;
    document.collabeditors.forEach((collabeditor) => {
      if (collabeditor.id === user._id) {
        permissions = collabeditor.permissions;
      }
    });
    return permissions;
  }
};

export { getPermissions };
