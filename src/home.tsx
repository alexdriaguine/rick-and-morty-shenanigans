import * as React from 'react'
import { Link } from 'react-router-dom'

export const Home = () => {
  return (
    <div>
      <Link to="/characters">All characters</Link>
    </div>
  )
}
