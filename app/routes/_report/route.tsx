import type { Route } from './+types/route'

export const meta = ({}: Route.MetaArgs) => {
  return [{ title: 'Replay 5525+1 年度报告' }, { name: 'description', content: 'Replay 5525+1 年度报告' }]
}

export default function ReportPage({}: Route.ComponentProps) {
  return (
    <div>
      <p>report</p>
    </div>
  )
}
