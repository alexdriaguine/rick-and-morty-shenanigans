import { Character, CollectionResult } from './characters.api'
import { createAction, createReducer } from '@reduxjs/toolkit'

export interface CharacterState {
  loading: boolean
  error?: string
  entries: Character[]
  numberOfPages: number
}

export const fetchCharactersPage = createAction<number>('allCharactersRequest')
export const fetchCharactersPageSuccess = createAction<
  CollectionResult<Character>
>('allCharactersSuccess')
export const allCharactersFail = createAction('allCharactersFail')

export const charactersReducer = createReducer<CharacterState>(
  { entries: [], loading: false, numberOfPages: 0 },
  (builder) => {
    builder
      .addCase(fetchCharactersPage, (state, action) => {
        state.loading = true
      })
      .addCase(fetchCharactersPageSuccess, (state, action) => {
        state.entries = [...state.entries, ...action.payload.results]
        state.loading = false
        state.numberOfPages = action.payload.info.pages
      })
      .addCase(allCharactersFail, (state) => {
        state.loading = false
        state.error = 'wubba dubba dub dub'
      })
  },
)
