import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootState'
import { allCharacters } from './characters.reducer'
import { Character } from './characters.api'
import { CharacterList } from './character-list'
import { useEffect } from 'react'
import * as React from 'react'

export const Characters = () => {
  const currentPage = useSelector<RootState, number>(
    (state) => state.characters.currentPage,
  )
  const characters = useSelector<RootState, Character[]>(
    (state) => state.characters.entries[currentPage - 1] ?? [],
  )

  const isLoading = useSelector<RootState, boolean>(
    (state) => state.characters.loading,
  )

  const numberOfPages = useSelector<RootState, number>(
    (state) => state.characters.numberOfPages,
  )
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(allCharacters(1))
  }, [dispatch])

  if (characters.length === 0 && !isLoading) {
    return <p>Nothing here</p>
  }

  return (
    <div>
      <CharacterList characters={characters} />
    </div>
  )
}
