import React from 'react'
import { Header } from '../../components/common'
import { observer } from 'mobx-react'
import RemoteBooksList from './RemoteShelve'
import { AddBookButton } from './common'
import LocalBooksList from './LocalShelve'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import Zoom from '@material-ui/core/Zoom'
import AddIcon from '@material-ui/icons/Add'
import './Shelves.scss'
import styled from 'styled-components'

const Content = styled.div`
  height: 100vh;
  overflow: auto;
`
const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(10),
    right: theme.spacing(2),
  },
  bottomMenu: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    left: 0,
  },
}))

export default observer(function Shelves() {
  const theme = useTheme()
  const [value, setValue] = React.useState(0)
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  }
  const handleChangeIndex = (index: number) => setValue(index)
  const handleChange = (event: any, index: number) => handleChangeIndex(index)
  const classes = useStyles()

  const fabs = [
    {
      color: 'primary',
      icon: <AddIcon />,
      label: 'Add',
      clickHandler: () => {
        console.log('hey you')
      },
    },
  ]

  return (
    <>
      <Header></Header>
      <Content>
        <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
          <LocalBooksList />
          <RemoteBooksList />
          <div>favorite</div>
        </SwipeableViews>
        {fabs.map((fab, index) => (
          <Zoom
            key={fab.color}
            in={value === index}
            timeout={transitionDuration}
            style={{
              transitionDelay: `${
                value === index ? transitionDuration.exit : 0
              }ms`,
            }}
            unmountOnExit
          >
            <AddBookButton />
          </Zoom>
        ))}
      </Content>

      <div className={classes.bottomMenu}>
        <BottomNavigation value={value} onChange={handleChange} showLabels>
          <BottomNavigationAction label="local" />
          <BottomNavigationAction label="remote" />
          <BottomNavigationAction label="fav" />
        </BottomNavigation>
      </div>
    </>
  )
})
