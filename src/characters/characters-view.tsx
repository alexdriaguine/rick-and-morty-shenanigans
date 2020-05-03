import { CharacterList } from './characters-list'
import * as React from 'react'
import { Search } from '../search'
import {
  useIntersection,
  usePrevious,
  useDebouncedValue,
  useQuery,
} from '../hooks'
import styled from '@emotion/styled'
import { Character, apiClient, CollectionResult } from '../api'
import { useHistory } from 'react-router-dom'
import { Spinner } from '../ui/spinner'

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
  | { type: 'fetchCharacters' }
  | { type: 'fetchCharactersSuccess'; data: CollectionResult<Character> }
  | { type: 'fetchCharactersFail'; error: string }

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'loadMore':
      if (state.currentPage + 1 > state.totalNumberOfPages) return state
      return { ...state, currentPage: state.currentPage + 1 }
    case 'setSearchTerm':
      return { ...state, searchTerm: action.searchTerm }
    case 'fetchCharacters':
      return {
        ...state,
        loading: true,
        error: undefined,
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

const useQuerySyncForSearchEffect = (searchTerm: string) => {
  const history = useHistory()
  React.useEffect(() => {
    if (searchTerm?.length > 0) {
      history.replace({
        search: `search=${searchTerm}`,
      })
    } else {
      history.replace({
        search: '',
      })
    }
  }, [searchTerm, history])
}

const useCharacterFetchEffect = ({
  searchTerm,
  dispatch,
  page,
}: {
  searchTerm: string
  dispatch: React.Dispatch<Action>
  page: number
}) => {
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500).trim()
  const previousSearchTerm = usePrevious(searchTerm, '')?.trim()

  React.useEffect(() => {
    const resetPage = debouncedSearchTerm !== previousSearchTerm
    const canSearch = debouncedSearchTerm?.length > 0

    const options = {
      page: resetPage ? 1 : page,
      name: canSearch ? debouncedSearchTerm : undefined,
    }

    const handleSuccess = (data: CollectionResult<Character>) =>
      dispatch({ type: 'fetchCharactersSuccess', data })
    const handleError = (err: { status?: number }) =>
      dispatch({
        type: 'fetchCharactersFail',
        error:
          err.status === 404
            ? 'Nothing to see here'
            : 'Wubbalubb dubb error happened',
      })

    dispatch({ type: 'fetchCharacters' })
    apiClient.getCharacters(options).then(handleSuccess).catch(handleError)

    // this is fine, we do not want to react to previous search term
    // only read the value, and it will not be stale, we just ignore running
    // the effect again if we re-render for some other reason and the
    // previous search term will be the same as current
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, debouncedSearchTerm])
}

export const Characters = () => {
  const search = useQuery().get('search')
  const [state, dispatch] = React.useReducer(reducer, {
    currentPage: 1,
    searchTerm: search || '',
    characters: [],
    loading: false,
    totalNumberOfPages: 1,
  })
  const [intersecting, intersectionRef] = useIntersection()

  useQuerySyncForSearchEffect(state.searchTerm)
  useCharacterFetchEffect({
    page: state.currentPage,
    searchTerm: state.searchTerm,
    dispatch,
  })

  React.useEffect(() => {
    if (intersecting) {
      dispatch({ type: 'loadMore' })
    }
  }, [intersecting])

  const handleSearchchange = (searchTerm: string) =>
    dispatch({
      type: 'setSearchTerm',
      searchTerm,
    })

  return (
    <div>
      <Search term={state.searchTerm} onChange={handleSearchchange} />
      {state.error && <Error>{state.error}</Error>}
      {state.characters.length > 0 && (
        <>
          <CharacterList characters={state.characters} />
          {state.currentPage < state.totalNumberOfPages && (
            <IntersectionAnchor ref={intersectionRef}>
              <Spinner />
            </IntersectionAnchor>
          )}
        </>
      )}
    </div>
  )
}

const IntersectionAnchor = styled.div`
  height: 64;
  margin: 16;
  display: flex;
  align-items: center;
  justify-content: center;
`
