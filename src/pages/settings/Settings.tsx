import { observer } from 'mobx-react'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Header } from '../../components/common'
import AppContext from '../../store/AppStore'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import styled from 'styled-components'

const FormControlStyled = styled(FormControl)`
  margin: 10px;
  minwidth: 200px;
`
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
  const handleLocaleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLocale(event.target.value as string)
  }
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
        <Grid item xs={12}>
          <FormControlStyled>
            <InputLabel id="language-select-label">
              {intl.formatMessage({ id: 'settings.language' })}
            </InputLabel>
            <Select
              labelId="language-select-label"
              value={locale}
              onChange={handleLocaleChange}
            >
              <MenuItem value={'ru'}>Русский</MenuItem>
              <MenuItem value={'en'}>English</MenuItem>
            </Select>
          </FormControlStyled>
        </Grid>

        <FormControlStyled>
          <FormLabel component="legend">
            Подсветка слов в тексте для упрощения поиска строк глазами
          </FormLabel>
          <FormControlLabel
            control={
              <Switch
                checked={wordsHighlight}
                onChange={handleToggleChange}
                name="toggleHightligting"
              />
            }
            label="Подсветка слов"
          />
        </FormControlStyled>
        <FormControlStyled>
          <FormLabel component="legend">
            Подстраивать положение текста в зависимости от ориентации устройства
          </FormLabel>
          <FormControlLabel
            control={
              <Switch
                checked={dynamicTextOrientation}
                onChange={handleToggleChange}
                name="toggleDynamicTextOrientation"
              />
            }
            label="Динамическая ориентация текста"
          />
        </FormControlStyled>
      </Grid>
    </>
  )
})
