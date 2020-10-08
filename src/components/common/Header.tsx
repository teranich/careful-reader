import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, useLocation } from 'react-router-dom';
import TuneIcon from '@material-ui/icons/Tune';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { AuthButtons } from '../controls';

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
});

export default observer(function Header({ children, className = '' }: any) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const title = location.pathname === '/' ? 'Feed' : 'Library'

  const toggleDrawer = (state: boolean) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(state)
  };

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <Link to="/">
          <ListItem button>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Feed" />
          </ListItem>
        </Link>
        <Link to="/shelves">
          <ListItem button>
            <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
            <ListItemText primary="Library" />
          </ListItem>
        </Link>
        <Link to="/settings">
          <ListItem button>
            <ListItemIcon><TuneIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </Link>
      </List>
      <Divider />
    </div>
  );
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <React.Fragment>
              <MenuIcon onClick={toggleDrawer(true)} />
              <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
                {list()}
              </Drawer>
            </React.Fragment>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          {children}
          <AuthButtons />
        </Toolbar>
      </AppBar>

    </>
  )
})
