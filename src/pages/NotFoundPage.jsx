import { Link, useLocation } from 'react-router'

export default function NotFoundPage() {
  const location = useLocation()
  const path = location.pathname || ''

  return(
    <div>
      <h2>Page not found{ path ? `: ${path}` : '' }</h2>
      <Link to='/'>
        Home
      </Link>
    </div>
  )
}
