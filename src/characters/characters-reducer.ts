import { Character, CollectionResult } from '../api'
import { createAction, createReducer } from '@reduxjs/toolkit'

export interface CharacterState {
  loading: boolean
  error?: string
  entries: Character[]
  numberOfPages: number
}

export const fetchCharactersPage = createAction<{
  page: number
  searchTerm?: string
}>('allCharactersRequest')
export const fetchCharactersPageSuccess = createAction<{
  data: CollectionResult<Character>
  replaceResults: boolean
}>('allCharactersSuccess')
export const allCharactersFail = createAction('allCharactersFail')

export const charactersReducer = createReducer<CharacterState>(
  { entries: [], loading: false, numberOfPages: 0 },
  (builder) => {
    builder
      .addCase(fetchCharactersPage, (state, action) => {
        state.loading = true
      })
      .addCase(fetchCharactersPageSuccess, (state, action) => {
        const { data, replaceResults } = action.payload
        state.entries = replaceResults
          ? data.results
          : [...state.entries, ...data.results]
        state.loading = false
        state.numberOfPages = data.info.pages
      })
      .addCase(allCharactersFail, (state) => {
        console.log('failing')
        state.loading = false
        state.error = 'wubba dubba dub dub'
      })
  },
)
