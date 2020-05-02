import { Character, CollectionResult } from '../api'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { RootState } from '../rootState'

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
export const fetchCharactersFail = createAction<{
  error: string
  status?: number
}>('allCharactersFail')

export const charactersReducer = createReducer<CharacterState>(
  { entries: [], loading: false, numberOfPages: 0 },
  (builder) => {
    builder
      .addCase(fetchCharactersPage, (state, action) => {
        state.loading = true
        state.error = undefined
      })
      .addCase(fetchCharactersPageSuccess, (state, action) => {
        const { data, replaceResults } = action.payload
        state.entries = replaceResults
          ? data.results
          : [...state.entries, ...data.results]
        state.loading = false
        state.numberOfPages = data.info.pages
      })
      .addCase(fetchCharactersFail, (state, action) => {
        state.loading = false
        state.error = action.payload.error
        state.entries = []
      })
  },
)

export const getCharacters = ({ characters }: RootState) => characters.entries
export const getIsLoading = ({ characters }: RootState) => characters.loading
export const getNumberOfPages = ({ characters }: RootState) =>
  characters.numberOfPages
export const getError = ({ characters }: RootState) => characters.error
