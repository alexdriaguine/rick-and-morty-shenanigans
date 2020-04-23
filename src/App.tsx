import * as React from 'react'
import styled from '@emotion/styled'
import { Global } from '@emotion/core'
import { globalStyle } from './globalStyles'
import { Characters } from './characters/characters.view'
import { Provider } from 'react-redux'
import { createStore } from './store'
import { Switch, Route, Link, BrowserRouter, Redirect } from 'react-router-dom'

const store = createStore()
const Main = styled.main`
  font-family: 'Open Sans', sans-serif;
  max-width: 760px;
  margin: 0 auto;
`

export const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Main>
          <Switch>
            <Redirect exact to="/characters" from="/" />
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
    </Provider>
  )
}
