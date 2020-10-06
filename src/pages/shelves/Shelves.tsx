import React, { ReactNode, useContext } from 'react'
import './Shelves.scss'

import { Header } from '../../components/common'
import { observer } from 'mobx-react'
import RemoteBooksList from './RemoteShelve'
import { AddBookButton } from './common'
import LocalBooksList from './LocalShelve'
import { Loading } from '../../components/loading'
import LibraryStoreContext from '../../store/LibraryStore'
import Container from '@material-ui/core/Container';
import SwipeableViews from 'react-swipeable-views';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

function TabPanel(props: any) {
  const { children, value, index } = props;
  return (
    <>
      {value === index && (
        <Container >
          {children}
        </Container>
      )}
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  }
}));

const bottomMenu: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  right: 0,
  left: 0
}
function ElevationScroll({ children }: any) {

  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default observer(function Shelves() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChangeIndex = (index: number) => (setValue(index))
  const handleChange = (event: any, index: number) => (handleChangeIndex(index))

  return (
    <>
      <Header>

      </Header>
      <SwipeableViews index={value} onChangeIndex={handleChangeIndex} className="swipeableViews">
        <div>
          <LocalBooksList />
        </div>
        <div  >
          {/* <RemoteBooksList /> */}
          remote
        </div>
        <div>
          favorite
        </div>
      </SwipeableViews>

      <div style={bottomMenu}>
        <BottomNavigation
          value={value}
          onChange={handleChange}
          showLabels
        >
          <BottomNavigationAction label="local" />
          <BottomNavigationAction label="remote" />
          <BottomNavigationAction label="fav" />
        </BottomNavigation>

      </div>
      {/* <AddBookButton className="add-button-fixed" /> */}
    </>
  )
})
