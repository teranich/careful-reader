import React from 'react'
import './Header.scss'
import { observer } from 'mobx-react'
import { BackButton, HomeButton, AuthButtons, SettingsButton } from '../controls'

export default observer(function Header({ children, className = '' }: any) {

  return (
    <header className={`header ${className}`}>
      <div className="left-content">
        <BackButton />
        <HomeButton />
        <SettingsButton />
      </div>
      <div className="children">{children} </div>
      <div className="right-content">
        <AuthButtons />
      </div>
    </header>
  )
})
