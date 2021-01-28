import React, { ReactNode } from 'react'
import './loading.scss'
import styled from 'styled-components'
interface ISwitcher {
  readonly switch: boolean
}
const Switcher = styled.div<ISwitcher>`
  display: ${(props) => (props.switch ? 'block' : 'none')};
`
interface TLoading {
  loading: boolean
  children: ReactNode
}
export default function Loading({ loading, children }: TLoading) {
  return (
    <>
      <Switcher switch={loading}>
        <div>Loading</div>
      </Switcher>
      {children}
    </>
  )
}
