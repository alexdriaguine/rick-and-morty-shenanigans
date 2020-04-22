import * as React from 'react'
import styled from '@emotion/styled'
import { Global } from '@emotion/core'
import { globalStyle } from './globalStyles'
import { Characters } from './characters/characters.view'
import { Provider } from 'react-redux'
import { createStore } from './store'

const store = createStore()
const Main = styled.main`
  font-family: 'Open Sans', sans-serif;
  max-width: 760px;
  margin: 0 auto;
`

export const App = () => {
  return (
    <Provider store={store}>
      <Main>
        <Characters />
      </Main>
      <Global styles={globalStyle} />
    </Provider>
  )
}
