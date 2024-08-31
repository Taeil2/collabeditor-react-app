const getPermissions = (document, user) => {
  if (document.owner === user._id) {
    return "owner";
  } else {
    document.collabeditors.forEach((collabeditor) => {
      if (collabeditor.id === user._id) {
        return collabeditor.permissions;
      }
    });
  }
  return null;
};

export { getPermissions };
