import * as React from 'react'
import {
  configureStore,
  createReducer,
  createAction,
  PayloadAction,
} from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'

interface RootState {
  loading: boolean
  characters: any[]
  currentPage: number
  numberOfPages: number
}

const allCharacters = createAction<number>('allCharactersRequest')
const allCharactersSuccess = createAction<{
  info: { count: number; pages: number; next: string; prev: string }
  results: any[]
}>('allCharactersSuccess')
const allCharactersFail = createAction('allCharactersFail')

const rootReducer = createReducer<RootState>(
  { characters: [], loading: false, currentPage: 1, numberOfPages: 0 },
  (builder) => {
    builder
      .addCase(allCharacters, (state, action) => {
        state.loading = true
        state.currentPage = action.payload
      })
      .addCase(allCharactersSuccess, (state, action) => {
        console.log(action)
        state.characters = action.payload.results
        state.numberOfPages = action.payload.info.pages
        state.loading = false
      })
      .addCase(allCharactersFail, (state) => {
        state.loading = false
      })
  },
)

const sagaMiddleware = createSagaMiddleware()

function* fetchSomething(action: PayloadAction<number>) {
  const page = action.payload
  let url = 'https://rickandmortyapi.com/api/character/'
  if (page > 1) {
    url += `?page=${page}`
  }
  console.log('I AM FETCHING!')
  const data = yield call(() =>
    fetch(url).then((res) => (res.ok ? res.json() : Promise.reject('fail'))),
  )
  yield put(allCharactersSuccess(data))
}

function* mySaga() {
  yield takeLatest(allCharacters.toString(), fetchSomething)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
})

sagaMiddleware.run(mySaga)

const Counter = () => {
  const characters = useSelector<RootState, any[]>((state) => state.characters)
  const currentPage = useSelector<RootState, number>(
    (state) => state.currentPage,
  )
  const numberOfPages = useSelector<RootState, number>(
    (state) => state.numberOfPages,
  )
  const dispatch = useDispatch()

  React.useEffect(() => {
    console.log('using the fucking effect')
    dispatch(allCharacters(currentPage))
  }, [currentPage, dispatch])

  return (
    <div>
      <h1>Rick & Morty Dex</h1>
      <p>Current page: {currentPage}</p>
      <button
        disabled={!(currentPage > 1 && numberOfPages > 0)}
        onClick={() => dispatch(allCharacters(currentPage - 1))}
      >
        Prev
      </button>
      <button
        disabled={!(currentPage < numberOfPages)}
        onClick={() => dispatch(allCharacters(currentPage + 1))}
      >
        Next
      </button>
      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {characters.map((c) => (
          <li style={{ listStyle: 'none' }} key={c.id}>
            <h4>{c.name}</h4>
            <img
              style={{ height: 100, width: 100 }}
              alt={c.name}
              src={c.image}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export const App = () => {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  )
}
