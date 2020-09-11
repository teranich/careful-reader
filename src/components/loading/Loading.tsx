import React, { ReactNode } from 'react'
import './loading.scss'

interface Loading {
  loading: boolean
  children: ReactNode
}
export default function Loading({ loading, children }: Loading) {
  console.log('chi', children)
  return (
    <>
      <div className={loading ? 'loading' : 'hidden'}>
        <div>Loading</div>
      </div>
      {children}
    </>
  )
}