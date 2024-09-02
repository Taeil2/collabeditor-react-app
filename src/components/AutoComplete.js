import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

import { grays, colors } from '../styles/styles'

const Container = styled.div`
  position: relative;
`

const Options = styled.div`
  position: absolute;
  width: 100%;
  background: #fff;
  border: 1px solid black;
  border-radius: 5px;
  border: 1px solid ${grays.gray3};
  overflow: hidden;
  & > div {
    padding: 0 10px;
    cursor: default;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
  & > div:nth-of-type(even) {
    background: ${grays.gray1};
  }
  & > div.selected {
    background: ${colors.lightCyan};
  }
`

export default function Autocomplete(props) {
  const {
    value,
    setValue,
    options,
    setNameSelected,
    selectedCollabeditor,
    setSelectedCollabeditor,
  } = props
  const [autocompleteList, setAutocompleteList] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const optionsRef = useRef()

  useEffect(() => {
    if (selectedCollabeditor?.name) {
      setValue(selectedCollabeditor?.name)
      setNameSelected(true)
    }
    // eslint-disable-next-line
  }, [selectedCollabeditor])

  const onChange = (e) => {
    setValue(e.target.value)
    if (e.target.value.length) {
      setAutocompleteList(
        options.filter((option) =>
          option.name.toLowerCase().includes(e.target.value.toLowerCase()),
        ),
      )
      const matchedCollabeditor = options.filter(
        (option) => option.name.toLowerCase() === e.target.value,
      )[0]
      if (matchedCollabeditor) {
        setSelectedCollabeditor(matchedCollabeditor)
        setNameSelected(true)
      } else {
        setSelectedCollabeditor({})
        setNameSelected(false)
      }
    } else {
      setAutocompleteList([])
      setSelectedCollabeditor({})
    }
    setSelectedIndex(-1)
  }

  const onKeyDown = (e) => {
    if (e.code === 'ArrowUp') {
      if (selectedIndex > 0) {
        // caps at the top
        setSelectedIndex(selectedIndex - 1)
      }
    } else if (e.code === 'ArrowDown') {
      if (selectedIndex < autocompleteList.length - 1) {
        // caps at the bottom
        setSelectedIndex(selectedIndex + 1)
      }
    } else if (e.code === 'Enter') {
      if (autocompleteList.length && selectedIndex !== -1) {
        const optionsDivs = optionsRef.current.children
        for (let div of optionsDivs) {
          if (div.className === 'selected') {
            setSelectedCollabeditor(
              options.filter(
                (option) => option.name.toLowerCase() === div.innerHTML,
              )[0],
            )
            // close autocomplete
            setSelectedIndex(-1)
            setAutocompleteList([])
          }
        }
      } else {
        // submit form
      }
    }
  }

  const onMouseEnter = (e) => {
    setSelectedIndex(e._targetInst.index)
  }

  const onSelect = (e) => {
    setSelectedCollabeditor(
      options.filter(
        (option) => option.name.toLowerCase() === e.target.innerHTML,
      )[0],
    )
    // close autocomplete
    setSelectedIndex(-1)
    setAutocompleteList([])
  }

  return (
    <Container>
      <input
        type="text"
        id="name"
        onChange={onChange}
        value={value}
        onKeyDown={onKeyDown}
      />
      {autocompleteList.length > 0 && (
        <Options ref={optionsRef}>
          {autocompleteList.map((item, i) => {
            return (
              <div
                onMouseEnter={onMouseEnter}
                onClick={onSelect}
                key={`option-${i}`}
                className={i === selectedIndex ? 'selected' : ''}
              >
                {item.name}
              </div>
            )
          })}
        </Options>
      )}
    </Container>
  )
}
