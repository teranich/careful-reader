import React from 'react'
import { Link } from 'react-router-dom'

export default function Feed() {
  return (
    <>
      <ul>
        <li>
          <Link to="/shelves">Shelves</Link>
        </li>
      </ul>
    </>
  )
}
