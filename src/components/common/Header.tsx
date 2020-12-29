import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { Link, useLocation } from 'react-router-dom'
import TuneIcon from '@material-ui/icons/Tune'
import DashboardIcon from '@material-ui/icons/Dashboard'
import { AuthButtons } from '../controls'
import LibraryStoreContext from '../../store/LibraryStore'
import styled from 'styled-components'

const TopHeightWorkaround = styled.div``
const Title = styled(Typography)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-grow: 1;
`
const useStyles = makeStyles({
  list: {
    width: 250,
  },
  menuButton: {
    marginRight: '',
  },
  title: {
    flexGrow: 1,
  },
})

export default observer(function Header({ children, className = '', title }: any) {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const pathTitleMap: any = {
    '/': 'Library',
    '/settings': 'Settings',
  }
  const pathname: string = location.pathname || ''
  const headTitle = title || pathTitleMap[pathname]
  const { currentBook } = useContext(LibraryStoreContext)

  const toggleDrawer = (state: boolean) => (event: any) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setIsOpen(state)
  }
  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {currentBook?.meta?.meta && (
          <Link to={`/read/${currentBook.meta.id}`}>
            <ListItem button>
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>
              <ListItemText primary={currentBook.meta.meta.title} />
            </ListItem>
          </Link>
        )}
        <Link to="/">
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>

        <Link to="/settings">
          <ListItem button>
            <ListItemIcon>
              <TuneIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </Link>
      </List>
      <Divider />
    </div>
  )
  return (
    <>
      <TopHeightWorkaround>
        <AppBar />
        <Toolbar />
      </TopHeightWorkaround>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <React.Fragment>
              <MenuIcon onClick={toggleDrawer(true)} />
              <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
                {list()}
              </Drawer>
            </React.Fragment>
          </IconButton>
          <Title variant="h6" >
            {headTitle}
          </Title>
          {children}
          <AuthButtons />
        </Toolbar>
      </AppBar>
    </>
  )
})
