import { Character, CollectionResult } from './characters.api'
import { createAction, createReducer } from '@reduxjs/toolkit'

export interface CharacterState {
  loading: boolean
  entries: Character[][]
  currentPage: number
  numberOfPages: number
}

export const allCharacters = createAction<number>('allCharactersRequest')
export const allCharactersSuccess = createAction<CollectionResult<Character>>(
  'allCharactersSuccess',
)
export const allCharactersFail = createAction('allCharactersFail')

export const charactersReducer = createReducer<CharacterState>(
  { entries: [], loading: false, currentPage: 1, numberOfPages: 0 },
  (builder) => {
    builder
      .addCase(allCharacters, (state, action) => {
        state.loading = true
        state.currentPage = action.payload
      })
      .addCase(allCharactersSuccess, (state, action) => {
        state.entries[state.currentPage - 1] = action.payload.results
        state.numberOfPages = action.payload.info.pages
        state.loading = false
      })
      .addCase(allCharactersFail, (state) => {
        state.loading = false
      })
  },
)
