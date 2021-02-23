import React, { ReactNode } from 'react'
import './loading.scss'
import styled from 'styled-components'
import { LinearProgress } from '@material-ui/core'
import { useContext } from 'react'
import { RootStoreContext } from '../../store/RootStore'
import { observer } from 'mobx-react'
interface ISwitcher {
  readonly switch: boolean
}
const Switcher = styled.div<ISwitcher>`
  display: ${(props) => (props.switch ? 'block' : 'none')};
`
interface TLoading {
  loading: boolean
  children: ReactNode
}
export default observer(function Loading({ loading, children }: TLoading) {
  return (
    <>
      <Switcher switch={loading}>
        <div>Loading</div>
      </Switcher>
      {children}
    </>
  )
})

export const LoadingLine = observer(() => {
  const { libraryStore, remoteLibraryStore } = useContext(RootStoreContext)
  const showLoading = remoteLibraryStore.isBooksLoading
    || remoteLibraryStore.isUploading
    || remoteLibraryStore.isDownloading
    || remoteLibraryStore.isBookRemoving
    || libraryStore.isAddingBookInProcess
    || libraryStore.isFetchingBooksInProcess

    return (<>{showLoading && <LinearProgress />}</>)
})
