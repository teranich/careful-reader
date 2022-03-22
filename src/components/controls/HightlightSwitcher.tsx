import { observer } from 'mobx-react';
import Checkbox from '@material-ui/core/Checkbox';
import { RootStoreContext } from '../../store/RootStore';
import { useContext } from 'react';

export default observer(function HightlightSwitcher() {
    const { appStore } = useContext(RootStoreContext);
    const { wordsHighlight, toggleHightligting } = appStore;

    const handleChange = (event) => {
        toggleHightligting(event.target.checked);
    };
    return (
        <Checkbox
            checked={wordsHighlight}
            onChange={handleChange}
        />
    );
});
