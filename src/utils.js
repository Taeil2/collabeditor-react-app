const getPermissions = (document, user) => {
  if (document.owner === user._id) {
    return 'owner'
  } else {
    let permissions
    document.collabeditors.forEach((collabeditor) => {
      if (collabeditor.id === user._id) {
        permissions = collabeditor.permissions
      }
    })
    return permissions
  }
}

const getReadableDate = (date) => {
  let hours = date.getHours() % 12
  let ampm = 'am'
  if (hours > 12) {
    ampm = 'pm'
  }
  if (hours === 0) {
    hours = 12
  }

  let minutes = date.getMinutes()
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  return (
    <span>
      {date.getMonth()}/{date.getDate()}
      &nbsp;&nbsp;
      {hours}:{minutes}
      {ampm}
    </span>
  )
}

export { getPermissions, getReadableDate }
