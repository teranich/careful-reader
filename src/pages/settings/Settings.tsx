import { observer } from 'mobx-react'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Header } from '../../components/common'
import Select, { SelectOption } from '../../components/common/Select'
import AppContext from '../../store/AppStore'
import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1, 1, 0, 0),
  },
}))
type THandlerMap = {
  [key: string]: Function
}
export default observer(function Settings() {
  const {
    locale,
    setLocale,
    wordsHighlight,
    toggleHightligting,
    dynamicTextOrientation,
    toggleDynamicTextOrientation,
  } = useContext(AppContext)
  const intl = useIntl()
  const options = [
    {
      id: 0,
      value: 'ru',
      text: 'ru',
    },
    {
      id: 1,
      value: 'en',
      text: 'en',
    },
  ]

  const handleLocaleChange = (option: SelectOption<string>) => {
    setLocale(option.value)
  }
  const initialLocaleOption =
    options.find((option) => option.value === locale) || options[0]
  const classes = useStyles()

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const handlersMap: THandlerMap = {
      toggleHightligting,
      toggleDynamicTextOrientation,
    }
    const handler = handlersMap[event.target.name]
    if (typeof handler === 'function') {
      handler(event.target.checked)
    }
  }

  return (
    <>
      <Header></Header>
      <Grid container>
        <Grid item md={12}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">
              Pop quiz: Material-UI is...
            </FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={wordsHighlight}
                  onChange={handleToggleChange}
                  name="toggleHightligting"
                />
              }
              label="Text hightlight"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={dynamicTextOrientation}
                  onChange={handleToggleChange}
                  name="toggleDynamicTextOrientation"
                />
              }
              label="Dynamic text orientation"
            />
          </FormControl>

          <ul>
            <li>
              {intl.formatMessage({ id: 'settings.language' })}
              <Select
                options={options}
                value={initialLocaleOption}
                onChange={handleLocaleChange}
              />
              {locale}
            </li>
          </ul>
        </Grid>
      </Grid>
    </>
  )
})
