import { MouseEventHandler, MutableRefObject, useEffect } from 'react'

type TUseBoubleClickProps = {
  ref: MutableRefObject<Element | undefined>
  latency?: number
  onSingleClick?: MouseEventHandler
  onDoubleClick?: MouseEventHandler
}
const useDoubleClick = ({
  ref,
  latency = 300,
  onSingleClick,
  onDoubleClick,
}: TUseBoubleClickProps) => {
  useEffect(() => {
    const clickRef = ref.current
    let clickCount = 0
    const handleClick = (e: any) => {
      clickCount += 1

      setTimeout(() => {
        if (clickCount === 1) onSingleClick && onSingleClick(e)
        else if (clickCount === 2) onDoubleClick && onDoubleClick(e)

        clickCount = 0
      }, latency)
    }

    clickRef?.addEventListener('click', handleClick)
    return () => {
      clickRef?.removeEventListener('click', handleClick)
    }
  })
}

export default useDoubleClick
