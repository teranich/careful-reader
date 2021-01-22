import React, { ReactNode } from 'react'
import './loading.scss'

interface TLoading {
  loading: boolean
  children: ReactNode
}
export default function Loading({ loading, children }: TLoading) {
  return (
    <>
      <div className={loading ? 'loading' : 'hidden'}>
        <div>Loading</div>
      </div>
      {children}
    </>
  )
}
