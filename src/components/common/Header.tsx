import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
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
import styled from 'styled-components';
import { RootStoreContext } from '../../store/RootStore';
import { LoadingLine } from '../loading/Loading';

const TopHeightWorkaround = styled.div``;
const Title = styled(Typography)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-grow: 1;
`;
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

const ContainerIS = styled.div`
    display: ${(props) => (props.visible ? 'block' : 'none')};
`;

const AppBarIS = styled(AppBar)`
    .MuiToolbar-regular {
    }
`;

const ListIS = styled(List)`
    padding: 8px 16px;
`;

export default observer(function Header({
    children,
    className = '',
    title,
    visible = true,
    content,
}: any) {
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const pathTitleMap: any = {
        '/': 'Library',
        '/settings': 'Settings',
    };
    const pathname: string = location.pathname || '';
    const headTitle = title || pathTitleMap[pathname];
    const {
        libraryStore: { lastBook },
    } = useContext(RootStoreContext);

    const toggleDrawer = (state: boolean) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setIsOpen(state);
    };
    const list = () => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {lastBook?.info?.meta && (
                    <Link to={`/read/${lastBook.info.id}`}>
                        <ListItem button>
                            <ListItemIcon>
                                <LibraryBooksIcon />
                            </ListItemIcon>
                            <ListItemText primary={lastBook.info.meta.title} />
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
            <ListIS>{content}</ListIS>
        </div>
    );
    return (
        <ContainerIS visible={visible}>
            <TopHeightWorkaround>
                <AppBar />
                <Toolbar />
            </TopHeightWorkaround>
            <AppBarIS position="fixed" id="app-bar">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                    >
                        <React.Fragment>
                            <MenuIcon onClick={toggleDrawer(true)} />
                            <Drawer
                                anchor="left"
                                open={isOpen}
                                onClose={toggleDrawer(false)}
                            >
                                {list()}
                            </Drawer>
                        </React.Fragment>
                    </IconButton>
                    <Title variant="h6">{headTitle}</Title>
                    {children}
                    <AuthButtons />
                </Toolbar>
                <LoadingLine />
            </AppBarIS>
        </ContainerIS>
    );
});

export const getCurrentHeaderHeight = () =>
    (document.querySelector('#app-bar')?.clientHeight || 64) - 1;
