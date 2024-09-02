import { useContext, useState } from 'react'
import styled from 'styled-components'

import Modal from '../../components/Modal'
import Button from '../../components/Button'

import { grays } from '../../styles/styles'

import { updateUser } from '../../server/users'
import { UserContext } from '../../contexts/UserContext'

const Form = styled.form`
  label {
    display: block;
    font-size: 16px;
    color: ${grays.gray6};
    margin-bottom: 10px;
  }
  input {
    width: 200px;
    margin-right: 10px;
  }
`

export default function NameModal(props) {
  const { user, setUser, users, setUsers } = useContext(UserContext)
  //  useContext(UserContext)
  const { setChangeNameOpen } = props

  const [name, setName] = useState(user.name)

  const onSubmit = async (e) => {
    e.preventDefault()

    if (name.match(/^ *$/) === null) {
      setChangeNameOpen(false)
      await updateUser(name, user._id)
      const userUpdate = { ...user }
      userUpdate.name = name
      setUser(userUpdate)

      // update the name in users, because the document cards query the users
      // the user name gets updated in the cards
      setUsers(
        users.map((u) => {
          if (u._id === user._id) {
            return userUpdate
          } else {
            return u
          }
        }),
      )
    }
  }

  return (
    <Modal closeButton={false}>
      <Form onSubmit={onSubmit}>
        <label htmlFor="name">What is your name?</label>
        <input
          id="name"
          type="text"
          value={name}
          placeholder=""
          onChange={(e) => {
            setName(e.target.value)
          }}
          autoFocus
        />
        <Button type="submit" text="okay" />
      </Form>
    </Modal>
  )
}
