import * as React from 'react'
import styled from '@emotion/styled'
import { Global } from '@emotion/core'
import { globalStyle } from './globalStyles'
import { Characters } from './characters/characters-view'
import { Switch, Route, Link, BrowserRouter } from 'react-router-dom'
import { Home } from './home'
import { Header } from './header'

const Main = styled.main`
  font-family: 'Open Sans', sans-serif;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
`

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Main>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/characters">
              <Characters />
            </Route>
            <Route path="*">
              nah not found
              <Link to="/">Go to home</Link>
            </Route>
          </Switch>
        </Main>
      </BrowserRouter>
      <Global styles={globalStyle} />
    </>
  )
}
