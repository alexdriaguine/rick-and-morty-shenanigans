import { CharacterList } from './characters-list'
import * as React from 'react'
import { Search } from '../search'
import { useIntersection, usePrevious, useDebouncedValue } from '../hooks'
import styled from '@emotion/styled'
import { Character, apiClient, CollectionResult } from '../api'

const Error = styled.div`
  background: salmon;
  margin: 0 16px;
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`

interface State {
  currentPage: number
  totalNumberOfPages: number
  searchTerm: string
  characters: Character[]
  loading: boolean
  error?: string
}

type Action =
  | { type: 'loadMore' }
  | { type: 'setSearchTerm'; searchTerm: string }
  | { type: 'fetchCharacters'; page: number }
  | { type: 'fetchCharactersSuccess'; data: CollectionResult<Character> }
  | { type: 'fetchCharactersFail'; error: string }

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'loadMore':
      console.log(state.currentPage, state.totalNumberOfPages)
      if (state.currentPage + 1 > state.totalNumberOfPages) return state
      return { ...state, currentPage: state.currentPage + 1 }
    case 'setSearchTerm':
      return { ...state, searchTerm: action.searchTerm }
    case 'fetchCharacters':
      return {
        ...state,
        loading: true,
        error: undefined,
        currentPage: action.page,
      }
    case 'fetchCharactersSuccess':
      return {
        ...state,
        characters: Boolean(action.data.info.prev)
          ? [...state.characters, ...action.data.results]
          : action.data.results,
        totalNumberOfPages: action.data.info.pages,
        error: undefined,
        loading: false,
      }
    case 'fetchCharactersFail':
      return {
        ...state,
        loading: false,
        error: action.error,
        characters: [],
      }
    default:
      return state
  }
}

export const Characters = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    currentPage: 1,
    searchTerm: '',
    characters: [],
    loading: false,
    totalNumberOfPages: 1,
  })
  const debouncedSearchTerm = useDebouncedValue(state.searchTerm, 500)
  const previousSearchTerm = usePrevious(debouncedSearchTerm, '')
  const [intersecting, intersectionRef] = useIntersection()

  React.useEffect(() => {
    let page = state.currentPage
    let searchTerm: string | undefined = undefined

    if (debouncedSearchTerm.trim() !== previousSearchTerm?.trim()) {
      page = 1
    }

    if (Boolean(debouncedSearchTerm) && debouncedSearchTerm.length >= 3) {
      searchTerm = debouncedSearchTerm
    }
    dispatch({ type: 'fetchCharacters', page })

    apiClient
      .getCharacters({ page, name: searchTerm })
      .then((res) => {
        dispatch({ type: 'fetchCharactersSuccess', data: res })
      })
      .catch((error) => {
        console.log(error)
        dispatch({
          type: 'fetchCharactersFail',
          error:
            error.status === 404
              ? 'Nothing to see here'
              : 'Wubbalubb dubb error happened',
        })
      })
    // this is fine, we do not want to react to previous search term
    // only read the value, and it will not be stale, we just ignore running
    // the effect again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, state.currentPage, debouncedSearchTerm])

  React.useEffect(() => {
    if (intersecting) {
      dispatch({ type: 'loadMore' })
    }
  }, [intersecting])

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 20,
          right: 20,
          zIndex: 1,
          width: 20,
          border: '2px solid teal',
        }}
      >
        {state.currentPage}
      </div>
      <Search
        term={state.searchTerm}
        onChange={(searchTerm) =>
          dispatch({
            type: 'setSearchTerm',
            searchTerm,
          })
        }
      />
      {state.error && <Error>{state.error}</Error>}
      {state.characters.length > 0 && (
        <>
          <CharacterList characters={state.characters} />
          {state.currentPage < state.totalNumberOfPages && (
            <div style={{ height: 100, margin: 30 }} ref={intersectionRef}>
              <span>Loading...</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
