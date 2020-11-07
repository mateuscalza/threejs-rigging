import React from 'react'
import styled from 'styled-components'
import Board from './components/board/board'

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  perspective: 100px;
`

function App() {
  return (
    <Wrapper>
      <Board />
    </Wrapper>
  )
}

export default App
