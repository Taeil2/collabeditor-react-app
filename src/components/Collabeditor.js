import { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { colors, grays } from '../styles/styles'
import { UserContext } from '../contexts/UserContext'

const colorsArr = Object.keys(colors).map((key) => [colors[key]])

const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  position: relative;
  margin-right: 3px;
  margin-bottom: 4px;
`

const Circle = styled.div`
  border-radius: 50%;
  width: 25px;
  height: 25px;
  background: ${(props) => {
    if (props.$index < 5) {
      return colorsArr[props.$index * 2]
    } else {
      return colorsArr[(props.$index - 5) * 2 + 1]
    }
  }};
  font-family: 'Open Sans', Arial, Helvetica, sans-serif;
  font-size: 16px;
  color: #fff;
  display: flex;
  justify-content: center;
  position: relative;
  cursor: default;
  margin: 0 2px;
  &:hover + .tag {
    opacity: 1;
  }
`

const Tag = styled.div`
  opacity: 0;
  position: absolute;
  z-index: 1;
  top: 29px;
  left: 0;
  border-radius: 4px;
  padding: 0 3px;
  height: 14px;
  line-height: 14px;
  font-size: 10px;
  color: #fff;
  background: ${(props) => {
    if (props.$index < 5) {
      return colorsArr[props.$index * 2]
    } else {
      return colorsArr[(props.$index - 5) * 2 + 1]
    }
  }};
  transition: opacity 200ms linear;
`

const OwnerLabel = styled.div`
  font-family: 'Noto Sans', Arial, Helvetica, sans-serif;
  font-size: 10px;
  color: ${grays.gray4};
`

export default function Collabeditor(props) {
  const { collabeditor, index, showTag = true, isOwner = false } = props

  const { users } = useContext(UserContext)

  const [matchedUser, setMatchedUser] = useState()

  useEffect(() => {
    setMatchedUser(users?.filter((u) => u._id === collabeditor)[0])
  }, [collabeditor, users])

  return (
    <Container>
      <Circle $index={index}>{matchedUser?.name?.toLowerCase()[0]}</Circle>
      {showTag && (
        <Tag className="tag" $index={index}>
          {matchedUser?.name?.toLowerCase()}
        </Tag>
      )}
      {isOwner && <OwnerLabel>owner</OwnerLabel>}
    </Container>
  )
}
