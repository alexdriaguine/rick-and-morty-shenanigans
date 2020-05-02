import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, takeLatest } from 'redux-saga/effects'
import { apiClient } from '../api'
import {
  fetchCharactersPage,
  fetchCharactersPageSuccess,
} from './characters-reducer'

function* fetchCharactersSaga(
  action: PayloadAction<{ page: number; searchTerm?: string }>,
) {
  const { page, searchTerm } = action.payload
  const options = {
    page: page > 1 ? page : undefined,
    name: searchTerm,
  }

  const data = yield call(apiClient.getCharacters, options)
  yield put(
    fetchCharactersPageSuccess({
      data,
      replaceResults: page === 1 && searchTerm !== undefined,
    }),
  )
}

// Saga for fetching characters, here we set up our relevant sagas for
// fetching characters
export function* charactersSaga() {
  // yield is a special keyword for generator functions
  // generators are special functions that simplify the tasks of writing iterators
  // it produces a sequense of results instead of a single value

  // takeLatest is an effect from saga that we can use with the "yield"
  // keyword. this effect runs when the "allCharacters" action is dispatched
  // take latest means, if we dispatch 10 actions in sequence, ignore/abort the
  // first 9 and execute the latest
  yield takeLatest(fetchCharactersPage.toString(), fetchCharactersSaga)
}