import * as React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Character, apiClient } from '../api'
import { Spinner } from '../ui/spinner'
import styled from '@emotion/styled'
import { StatusIcon } from './character-components'

const CharacterImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
`

export const CharacterDetails = () => {
  const [loading, setLoading] = React.useState(true)
  const [character, setCharacter] = React.useState<Character>()
  const [error, setError] = React.useState<{ status: number }>()
  const { id } = useParams<{ id: string }>()
  React.useEffect(() => {
    apiClient
      .getCharacter({ id: +id })
      .then((data) => {
        setCharacter(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [id])

  if (loading)
    return (
      <div
        style={{
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Spinner width={200} height={200} borderWidth={4} />
        <CharacterInfoBox>
          <CharacterName>
            XXXXX <StatusIcon status={'Unknown'} />
          </CharacterName>
          <p>xxxxx</p>
        </CharacterInfoBox>
      </div>
    )
  if (!loading && character)
    return (
      <div
        style={{
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <CharacterImage src={character.image} alt={character.name} />
        <CharacterInfoBox>
          <CharacterName>
            {character.name} <StatusIcon status={character.status} />
          </CharacterName>
          <p>{character.location.name}</p>
        </CharacterInfoBox>
      </div>
    )
  if (error)
    return (
      <div>
        Something went wrong.
        {error.status === 404 && (
          <p>This is not the character you were looking for</p>
        )}
        <Link to="/characters">Go back</Link>
      </div>
    )
  return <p>haha</p>
}

const CharacterName = styled.h3`
  text-transform: uppercase;
`

const CharacterInfoBox = styled.div`
  background: lightsalmon;
  max-width: 420px;
  width: 100%;
  transform: translate(0, -32px);
  padding: 16px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
`
