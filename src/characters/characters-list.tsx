import * as React from 'react'
import styled from '@emotion/styled'
import { Character } from '../api'
import { Link } from 'react-router-dom'
import { StatusIcon } from './character-components'

const StyledCharacterList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0;
  padding: 16px;

  & > * {
    margin-top: 0;
    margin-bottom: 0;
  }

  & > * + * {
    margin-top: 24px;
  }
`

const CharacterListItem = styled.li`
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 8px;
`

const CharacterImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-right: 16px;
`

const CharacterInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`

const CharacterName = styled.p`
  font-weight: 600;
  font-size: 16px;
  margin: 0;
`

const CharacterLocation = styled.p`
  font-size: 12px;
  margin: 0;
`

interface Props {
  characters: Character[]
}

const CharacterLink = styled(Link)`
  display: block;
  color: #444;
  text-decoration: none;
  &:visited {
    color: #444;
  }
`

export const CharacterList = ({ characters }: Props) => {
  return (
    <StyledCharacterList>
      {characters.map(({ id, name, image, location, status }) => (
        <CharacterLink key={id} to={`/character/${id}`}>
          <CharacterListItem>
            <CharacterImage alt={name} src={image} />
            <CharacterInfo>
              <div>
                <CharacterName>{name}</CharacterName>
                <CharacterLocation>{location.name}</CharacterLocation>
              </div>
              <StatusIcon status={status} />
            </CharacterInfo>
          </CharacterListItem>
        </CharacterLink>
      ))}
    </StyledCharacterList>
  )
}
