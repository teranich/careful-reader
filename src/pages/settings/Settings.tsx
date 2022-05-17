import { observer } from 'mobx-react'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Header } from '../../components/common'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import styled from 'styled-components'
import PageCoverImage1 from '../../static/page1.jpg'
import PageCoverImage2 from '../../static/page2.jpg'
import PageCoverImage3 from '../../static/page3.jpg'
import { RootStoreContext } from '../../store/RootStore'

const FormControlStyled = styled(FormControl)`
  margin: 10px;
  min-width: 200px;
`
const CoverImage = styled.img`
  height: 56px;
`

export default observer(function Settings() {
  const { appStore } = useContext(RootStoreContext)
  const {
    locale,
    imageCover,
    wordsHighlight,
    isUseImageCover,
    pageBackgroundColor,
    dynamicTextOrientation,
  } = appStore
  const intl = useIntl()
  const handleInputChange = (
    event: React.ChangeEvent<any>
  ) => {
    const handlerName: string = event.target.name
    const handlerParams = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    //@ts-ignore
    const handler = appStore[handlerName]
    if (typeof handler === 'function') {
      handler(handlerParams)
    }
  }

  const getUseImageCoverTitle = () =>
    isUseImageCover ? 'изображение' : 'сплошной текст'

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
              name="setLocale"
              onChange={handleInputChange}
            >
              <MenuItem value={'ru'}>Русский</MenuItem>
              <MenuItem value={'en'}>English</MenuItem>
            </Select>
          </FormControlStyled>
        </Grid>
        <Grid item xs={12}>
          <FormControlStyled>
            <FormLabel component="legend">
              Подсветка слов в тексте для упрощения поиска строк глазами
            </FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={wordsHighlight}
                  onChange={handleInputChange}
                  name="toggleHightligting"
                />
              }
              label="Подсветка слов"
            />
          </FormControlStyled>
        </Grid>
        <Grid item xs={12}>
          <FormControlStyled>
            <FormLabel component="legend">
              Подстраивать положение текста в зависимости от ориентации
              устройства
            </FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={dynamicTextOrientation}
                  onChange={handleInputChange}
                  name="toggleDynamicTextOrientation"
                />
              }
              label="Динамическая ориентация текста"
            />
          </FormControlStyled>
        </Grid>
        <Grid item xs={12}>
          <FormControlStyled>
            <FormLabel component="legend">Подложка книги</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={isUseImageCover}
                  onChange={handleInputChange}
                  name="toggleUseImageCover"
                />
              }
              label={getUseImageCoverTitle()}
            />
          </FormControlStyled>
          {isUseImageCover && <FormControlStyled>
            <InputLabel id="cover-image-select-label">
              {intl.formatMessage({ id: 'settings.coverImage' })}
            </InputLabel>
            <Select
              labelId="cover-image-select-label"
              value={imageCover}
              name="setImageCoverAction"
              onChange={handleInputChange}
            >
              <MenuItem value={'1'}>
                <CoverImage src={PageCoverImage1} />
              </MenuItem>
              <MenuItem value={'2'}>
                <CoverImage src={PageCoverImage2} />
              </MenuItem>
              <MenuItem value={'3'}>
                <CoverImage src={PageCoverImage3} />
              </MenuItem>
            </Select>
          </FormControlStyled>}
          {!isUseImageCover && <FormControlStyled>
            <TextField
              id="cover-bg-color-input-label"
              label={intl.formatMessage({ id: 'settings.coverBgColor' })}
              type="text"
              value={pageBackgroundColor}
              name="setPageBackgroundColorAction"
              onChange={handleInputChange}
              margin="normal"
            />
          </FormControlStyled>
          }
        </Grid>
      </Grid>
    </>
  )
})
