export interface PaginationInfo {
  count: number
  pages: number
  next?: string
  prev?: string
}

export interface CollectionResult<TResult> {
  info: PaginationInfo
  results: TResult[]
}

export interface Location {
  name: string
  url: string
}

export type Gender = 'female' | 'male' | 'genderless' | 'unknown'

export interface Character {
  id: string
  name: string
  statis: 'Dead' | 'Alive' | 'Unknown'
  species: string
  type: string
  gender: Gender
  origin: Location
  location: Location
  image: string
  episode: string[]
  url: string
  created: string
}

const checkResponse = (res: Response) =>
  res.ok ? res : Promise.reject('Shit on the floor: ' + res.status)

const parseJson = <TResponse>(res: Response): Promise<TResponse> => res.json()
const makeRequest = <
  TResponse,
  TOptions extends { [key: string]: string | number }
>(
  endpoint: 'character',
) => (options?: TOptions): Promise<TResponse> => {
  const BASE_URL = 'https://rickandmortyapi.com/api'
  const query = options
    ? Object.keys(options)
        .reduce<string[]>((acc, key) => {
          return [
            ...acc,
            `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`,
          ]
        }, [])
        .join('&')
    : undefined

  let url = `${BASE_URL}/${endpoint}`

  if (query) {
    url += `?${query}`
  }

  return fetch(url)
    .then(checkResponse)
    .then((res) => parseJson<TResponse>(res))
}

export const apiClient = {
  getCharacter: makeRequest<Character, { id: number }>('character'),
  getCharacters: makeRequest<CollectionResult<Character>, { page: number }>(
    'character',
  ),
}
