import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, takeLatest } from 'redux-saga/effects'
import { apiClient } from './characters.api'
import { allCharactersSuccess, allCharacters } from './characters.reducer'

function* fetchCharacters(action: PayloadAction<number>) {
  const page = action.payload
  const options = page > 1 ? { page } : undefined
  const data = yield call(apiClient.getCharacters, options)
  yield put(allCharactersSuccess(data))
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
  yield takeLatest(allCharacters.toString(), fetchCharacters)
}
