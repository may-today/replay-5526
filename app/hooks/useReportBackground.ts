import { useSetAtom } from 'jotai'
import { useContext, useEffect } from 'react'
import type { ReportBackground } from '~/data/types'
import { CurrentInViewContext } from '~/lib/context'
import { selectedReportBackgroundAtom } from '~/stores/app'

// set report background when in view, and can trigger manually by calling the function
export const useReportBackground = (
  type: ReportBackground['type'],
  opacity = 1
): { triggerReportBackground: (type: ReportBackground['type'], opacity?: number) => void } => {
  const setSelectedReportBackground = useSetAtom(selectedReportBackgroundAtom)
  const { inView } = useContext(CurrentInViewContext)
  useEffect(() => {
    if (!inView) {
      return
    }
    console.log('set background: ', type, opacity)
    setSelectedReportBackground({
      type,
      opacity,
    })
  }, [type, opacity, setSelectedReportBackground, inView])

  return {
    triggerReportBackground: (type: ReportBackground['type'], opacity = 1) => {
      setSelectedReportBackground({
        type,
        opacity,
      })
    },
  }
}
