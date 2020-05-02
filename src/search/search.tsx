import * as React from 'react'
import { SearchIcon } from '../icon'
import styled from '@emotion/styled'

interface Props {
  term: string
  onChange: (value: string) => void
}

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 4px 8px;
  border: 0;
  border-radius: 4px;
  background: lightgrey;
`

const SearchForm = styled.form<{ moveIcon: boolean }>`
  padding: 16px;
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    pointer-events: none;
    transition: all 0.2s ease-in-out;
    transform: translate(8px, 0);
    ${(props) =>
      props.moveIcon && 'transform: translate(calc(100vw - 64px), 0);'};

    @media (min-width: 760px) {
      ${(props) =>
        props.moveIcon && 'transform: translate(calc(760px - 64px), 0);'};
    }
  }
`

export const Search = ({ term, onChange }: Props) => {
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <SearchForm moveIcon={isFocused || Boolean(term)}>
      <SearchIcon />
      <Input
        value={term}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </SearchForm>
  )
}
