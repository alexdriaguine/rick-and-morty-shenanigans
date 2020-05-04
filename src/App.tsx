import * as React from 'react'
import styled from '@emotion/styled'
import { Global } from '@emotion/core'
import { globalStyle } from './globalStyles'
import {
  Switch,
  Route,
  Link,
  BrowserRouter,
  useLocation,
} from 'react-router-dom'
import { Home } from './home'
import { Header } from './header'
import { useTransition, animated } from 'react-spring'
import { Characters } from './characters/characters-view'
import { CharacterDetails } from './characters/character-details-view'

const Main = styled.main`
  font-family: 'Open Sans', sans-serif;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
`

const AnimatedRouteWrapper = styled(animated.div)`
  position: absolute;
  top: 64px;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
`

export const App = () => {
  const location = useLocation()

  const transitionStyles = {
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  }
  const transitions = useTransition(
    location,
    (location) => location.pathname,
    transitionStyles,
  )

  React.useEffect(() => {
    console.log(location.pathname)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <Main>
        <Header />
        {transitions.map(({ item: location, props: style, key }) => (
          <AnimatedRouteWrapper key={key} style={style}>
            <Switch location={location}>
              <Route component={Home} exact path="/" />
              <Route component={Characters} exact path="/characters" />
              <Route component={CharacterDetails} path="/characters/:id" />
              <Route path="*">
                nah not found
                <Link to="/">Go to home</Link>
              </Route>
            </Switch>
          </AnimatedRouteWrapper>
        ))}
      </Main>
      <Global styles={globalStyle} />
    </>
  )
}
