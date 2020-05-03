import * as React from 'react'
import { Route } from 'react-router-dom'
import { Characters } from './characters-view'
import { CharacterDetails } from './character-details-view'

export const CharacterRoutes = () => (
  <>
    <Route component={Characters} exact path="/characters" />
    <Route component={CharacterDetails} exact path="/characters/:id" />
  </>
)
