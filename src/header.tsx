import * as React from 'react'
import styled from '@emotion/styled'

const HeaderWrapper = styled.header`
  height: 64px;
  width: 100%;
  display: flex;
  border-bottom: 1px solid black;
`

const HeaderContent = styled.div`
  font-family: 'Open Sans', sans-serif;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`

const Navigation = () => <nav>Nav</nav>

export const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderContent>
        <h1 style={{ fontSize: 20 }}>Rick and Morty Pokedex</h1>
        <Navigation />
      </HeaderContent>
    </HeaderWrapper>
  )
}
