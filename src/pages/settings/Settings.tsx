import { observer } from 'mobx-react'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Header } from '../../components/common'
import Select, { SelectOption } from '../../components/common/Select'
import AppContext from '../../store/AppStore'

export default observer(function Settings() {
  const { locale, setLocale } = useContext(AppContext)
  const intl = useIntl()
  const options = [{
    id: 0,
    value: 'ru',
    text: 'ru'
  }, {
    id: 1,
    value: 'en',
    text: 'en'
  }]

  const handleLocaleChange = (option: SelectOption<string>) => {
    setLocale(option.value)
  }
  const initialLocaleOption = options.find(option => option.value === locale) || options[0]

  return <>
    <Header></Header>
    <ul>
      <li>
        {intl.formatMessage({ id: 'settings.language' })}
        <Select
          options={options}
          value={initialLocaleOption}
          onChange={handleLocaleChange} />
        {locale}
      </li>
    </ul>

  </>
})