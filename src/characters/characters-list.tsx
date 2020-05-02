import * as React from 'react'
import styled from '@emotion/styled'
import { Character } from '../api'

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

const CharacterName = styled.span`
  font-weight: 600;
  font-size: 16px;
`

const CharacterLocation = styled.span`
  font-size: 12px;
`

const StatusIcon = (props: { status: 'Alive' | 'Dead' | 'Unknown' }) => {
  const iconMap: Record<'Alive' | 'Dead' | 'Unknown', string> = {
    Alive: '😀',
    Dead: '💀',
    Unknown: '❓',
  }

  const icon = iconMap[props.status] || iconMap['Unknown']
  return (
    <span role="img" aria-label="dude">
      {icon}
    </span>
  )
}

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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <CharacterName>{c.name}</CharacterName>
              <CharacterLocation>{c.location.name}</CharacterLocation>
            </div>
            <StatusIcon status={c.status} />
          </CharacterInfo>
        </CharacterListItem>
      ))}
    </StyledCharacterList>
  )
}
