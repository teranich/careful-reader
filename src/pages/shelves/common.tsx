import { observer } from 'mobx-react';
import { readFileContent } from '../../utils/common';
import React, { useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { RootStoreContext } from '../../store/RootStore';

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'absolute',
        right: 0,
        bottom: theme.spacing(8),
    },
    fab: {
        right: theme.spacing(2),
    },
    input: {
        display: 'none',
    },
}));
export function b64EncodeUnicode(str) {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }),
    );
}

// Decoding base64 ⇢ UTF8

export function b64DecodeUnicode(str) {
    return decodeURIComponent(
        atob(str)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(''),
    );
}
const AddBookButton = observer(({ ...rest }: any) => {
    const {
        libraryStore: { addBookAction },
    } = useContext(RootStoreContext);
    const theme = useTheme();
    const classes = useStyles(theme);

    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files?.length) {
            const file = event.target.files[0];
            readFileContent(file).then((text: string) => {
                // const encoded = b64EncodeUnicode(text);
                // console.log(encoded);
                addBookAction(text, file.name, file.type);
            });
        }
    }

    return (
        <label className={classes.container} {...rest} htmlFor="btn-add-book">
            <input
                type="file"
                name=""
                id="btn-add-book"
                onChange={onChangeHandler}
                accept=".fb2,.pdf"
                className={classes.input}
            />
            <Fab color="primary" component="span" className={classes.fab}>
                <AddIcon />
            </Fab>
        </label>
    );
});

const BooksListPlaceholder = observer(() => (
    <div className="book-list-placeholder">
        <div className="centered">
            <div>
                Welcome! You haven't uploaded any books yet. Careful Reader supports
                <strong>&nbsp;fb2&nbsp;</strong>
                ones.
            </div>
            <AddBookButton className="add-btn-placeholder" />
        </div>
    </div>
));

export { AddBookButton, BooksListPlaceholder };
