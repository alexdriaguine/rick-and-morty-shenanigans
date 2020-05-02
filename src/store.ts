import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { charactersReducer } from './characters/characters-reducer'
import { charactersSaga } from './characters/characters-saga'

const sagaMiddleware = createSagaMiddleware()

export const createStore = () => {
  const store = configureStore({
    reducer: {
      characters: charactersReducer,
    },
    middleware: [sagaMiddleware],
  })

  sagaMiddleware.run(charactersSaga)
  return store
}
