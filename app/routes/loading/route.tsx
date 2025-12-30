import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'

export default function LoadingPage() {
  const navigate = useNavigate()
  return (
    <div>
      <p>Loading</p>
      <Button onClick={() => navigate('/report', { replace: true, viewTransition: true })}>Go to Report</Button>
    </div>
  )
}
