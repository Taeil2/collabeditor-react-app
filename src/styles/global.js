import styled from 'styled-components'
import { grays } from './styles'

const GlobalStyles = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

  main {
    font-family: 'Noto Sans', Arial, Helvetica, sans-serif;
    color: ${grays.gray8};
    max-width: 1040px;
    margin: 0 auto;
    padding: 50px 20px;
    font-size: 14px;
  }

  a {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    &:visited {
      color: inherit;
    }
  }

  h1 {
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 48px;
  }

  h2 {
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    font-weight: 500;
    font-size: 40px;
  }

  h3 {
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 32px;
    margin-bottom: 10px;
  }

  h4 {
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 24px;
    margin-bottom: 20px;
  }

  h5 {
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 20px;
    margin-bottom: 10px;
    margin-top: 20px;
  }

  h6 {
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #5c7eff;
  }

  p {
    line-height: 1.4em;
  }

  label {
    font-size: 14px;
    color: ${grays.gray6};
    margin-bottom: 5px;
  }

  textarea:focus,
  input:focus {
    outline: none;
  }

  input[type='text'],
  select {
    height: 35px;
    border-radius: 5px;
    border: 1px solid ${grays.gray3};
    font-size: 16px;
    padding: 0 10px;
    color: ${grays.gray8};
  }
`

export default GlobalStyles
