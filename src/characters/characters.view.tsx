import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootState'
import { fetchCharactersPage } from './characters.reducer'
import { CharacterList } from './character-list'
import * as React from 'react'

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

export const Characters = () => {
  const [currentPage, setCurrentPage] = React.useState(1)

  const characters = useSelector(getCharacters)
  const isLoading = useSelector(getIsLoading)
  const totalNumberOfPages = useSelector(getNumberOfPages)
  const dispatch = useDispatch()

  const [intersecting, intersectionRef] = useIntersection()

  React.useEffect(() => {
    dispatch(fetchCharactersPage(currentPage))
  }, [dispatch, currentPage])

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
