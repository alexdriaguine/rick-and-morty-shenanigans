import * as React from 'react'
import styled from '@emotion/styled'
import { Character } from './characters.api'

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
    margin-top: 16px;
  }
`

const CharacterListItem = styled.li`
  border-radius: 8px;
  display: flex;
  align-items: center;
  overflow: hidden;
`

const CharacterImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-right: 16px;
`

const CharacterInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
`

const CharacterName = styled.span`
  font-weight: 600;
`

interface Props {
  characters: Character[]
}

export const CharacterList = ({ characters }: Props) => {
  return (
    <StyledCharacterList>
      {characters.map((c) => (
        <CharacterListItem key={c.id}>
          <CharacterImage alt={c.name} src={c.image} />
          <CharacterInfo>
            <CharacterName>{c.name}</CharacterName>
            <span>{c.location.name}</span>
          </CharacterInfo>
        </CharacterListItem>
      ))}
    </StyledCharacterList>
  )
}
