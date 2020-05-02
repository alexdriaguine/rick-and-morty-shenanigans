import { useSelector, useDispatch } from 'react-redux'
import {
  fetchCharactersPage,
  getCharacters,
  getIsLoading,
  getNumberOfPages,
  getError,
} from './characters-reducer'
import { CharacterList } from './characters-list'
import * as React from 'react'
import { Search } from '../search'
import { useIntersection, usePrevious, useDebouncedValue } from '../hooks'
import styled from '@emotion/styled'

const Error = styled.div`
  background: salmon;
  margin: 0 16px;
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Characters = () => {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500)
  const previousSearchTerm = usePrevious(debouncedSearchTerm, '')

  const dispatch = useDispatch()

  const characters = useSelector(getCharacters)
  const isLoading = useSelector(getIsLoading)
  const totalNumberOfPages = useSelector(getNumberOfPages)
  const error = useSelector(getError)

  const [intersecting, intersectionRef] = useIntersection()

  React.useEffect(() => {
    let page = currentPage
    let searchTerm: string | undefined = undefined

    if (debouncedSearchTerm !== previousSearchTerm) {
      page = 1
    }

    if (Boolean(debouncedSearchTerm) && debouncedSearchTerm.length >= 3) {
      searchTerm = debouncedSearchTerm
    }

    dispatch(
      fetchCharactersPage({
        page,
        searchTerm,
      }),
    )
    // this is fine, we do not want to react to previous search term
    // only read the value, and it will not be stale, we just ignore running
    // the effect again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, debouncedSearchTerm])

  React.useEffect(() => {
    if (intersecting) {
      setCurrentPage((page) => page + 1)
    }
  }, [intersecting])

  return (
    <div>
      <Search term={searchTerm} onChange={setSearchTerm} />
      {error && <Error>{error}</Error>}
      {Array.isArray(characters) && characters.length > 0 && (
        <>
          <CharacterList characters={characters} />
          {currentPage < totalNumberOfPages && (
            <div style={{ height: 100, margin: 30 }} ref={intersectionRef}>
              <span style={{ display: isLoading ? 'block' : 'none' }}>
                Loading...
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
