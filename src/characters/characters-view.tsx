import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootState'
import { fetchCharactersPage } from './characters-reducer'
import { CharacterList } from './characters-list'
import * as React from 'react'
import { Search } from '../search'

// Move to reducer
const getCharacters = ({ characters }: RootState) => characters.entries
const getIsLoading = ({ characters }: RootState) => characters.loading
const getNumberOfPages = ({ characters }: RootState) => characters.numberOfPages

const useIntersection = (): [boolean, React.RefObject<HTMLDivElement>] => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [intersecting, setIntersecting] = React.useState(false)
  const [observer] = React.useState(() => {
    return new IntersectionObserver(
      (entries) => {
        const [e] = entries
        setIntersecting(e.isIntersecting)
      },
      {
        threshold: 1,
        root: null,
        rootMargin: '0px',
      },
    )
  })

  React.useEffect(() => {
    const node = ref.current
    node && observer.observe(node)
    return () => {
      node && observer.unobserve(node)
    }
  })

  return [intersecting, ref]
}

function usePrevious<T>(value: T, defaultValue?: T) {
  const ref = React.useRef<T>()

  React.useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current ?? defaultValue
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export const Characters = () => {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500)
  const previousSearchTerm = usePrevious(debouncedSearchTerm, '')

  const dispatch = useDispatch()

  const characters = useSelector(getCharacters)
  const isLoading = useSelector(getIsLoading)
  const totalNumberOfPages = useSelector(getNumberOfPages)

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

    console.log({ currentPage, searchTerm })

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

  if (characters.length === 0) {
    return null
  }

  return (
    <div>
      <Search term={searchTerm} onChange={setSearchTerm} />
      <CharacterList characters={characters} />
      {currentPage < totalNumberOfPages && (
        <div style={{ height: 100, margin: 30 }} ref={intersectionRef}>
          <span style={{ display: isLoading ? 'block' : 'none' }}>
            Loading...
          </span>
        </div>
      )}
    </div>
  )
}
