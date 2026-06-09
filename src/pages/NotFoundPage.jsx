import { Link } from 'react-router'

export default function NotFoundPage() {
  return(
    <div>
      <h1>Not found</h1>
      <Link to='/'>
        Home
      </Link>
    </div>
  )
}
