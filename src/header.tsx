import * as React from 'react'
import styled from '@emotion/styled'
import { useHistory, Link } from 'react-router-dom'

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
  const history = useHistory()
  const path = history.location.pathname.split('/').filter((p) => p)
  const showBackButton = path[0] === 'character' && path.length > 1
  return (
    <HeaderWrapper>
      <HeaderContent>
        {showBackButton ? (
          <Link
            onClick={(e) => {
              // have to prop to show anchors href, but
              // navigate via history so we can use the goBack function
              e.preventDefault()
              history.goBack()
            }}
            to={path[0]}
          >
            Back
          </Link>
        ) : (
          <h1 style={{ fontSize: 20 }}>Rick and Morty Pokedex</h1>
        )}
        <Navigation />
      </HeaderContent>
    </HeaderWrapper>
  )
}
