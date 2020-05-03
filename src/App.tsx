import * as React from 'react'
import styled from '@emotion/styled'
import { Global } from '@emotion/core'
import { globalStyle } from './globalStyles'
import { CharacterRoutes } from './characters/character-routes'
import { Switch, Route, Link, BrowserRouter, Redirect } from 'react-router-dom'
import { Home } from './home'
import { Header } from './header'
import { Transition, animated, config } from 'react-spring/renderprops'
import { Characters } from './characters/characters-view'
import { CharacterDetails } from './characters/character-details-view'

const Main = styled.main`
  font-family: 'Open Sans', sans-serif;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
`

const Fill = styled.div`
  top: 64px;
  position: absolute;
  width: 100%;
  max-width: 760px;
`

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Route
          render={(props) => {
            return (
              <Main>
                <Header />
                <Transition
                  keys={props.location.pathname.split('/')[1]}
                  from={{ opacity: 0, transform: 'translateY(100%)' }}
                  enter={{ opacity: 1, transform: 'translateY(0)' }}
                  leave={{ opacity: 0, transform: 'translateY(100%)' }}
                  items={props.location}
                >
                  {(loc, state) => (style) => {
                    return (
                      <Switch
                        location={state === 'update' ? props.location : loc}
                      >
                        <Route component={Home} exact path="/" />
                        <Route
                          render={() => (
                            <Fill>
                              <animated.div style={{ ...style }}>
                                <Characters />
                              </animated.div>
                            </Fill>
                          )}
                          path="/characters"
                        />
                        <Route
                          render={() => (
                            <Fill>
                              <animated.div style={{ ...style }}>
                                <CharacterDetails />
                              </animated.div>
                            </Fill>
                          )}
                          path="/character/:id"
                        />
                        <Route path="*">
                          nah not found
                          <Link to="/">Go to home</Link>
                        </Route>
                      </Switch>
                    )
                  }}
                </Transition>
              </Main>
            )
          }}
        />
      </BrowserRouter>
      <Global styles={globalStyle} />
    </>
  )
}
