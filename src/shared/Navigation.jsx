import { NavLink } from 'react-router'
import { useAuth } from '../contexts/AuthContext.jsx'
import Logoff from '../features/Logoff.jsx'

export default function Navigation() {
  const { isAuthenticated } = useAuth()

  function navLinkStyle({ isActive }) {
    if (isActive) {
      return {
        fontWeight: 'bold',
        textDecoration: 'underlined',
      }
    } else {
      return {
        textDecoration: 'none',
      }
    }
  }

  return(
    <nav>
      <ul style={{
        listStyle: 'none',
        display: 'flex',
        gap: '1rem',
        padding: 0
        }}
      >
        <li>
          <NavLink to='/about' style={navLinkStyle}>About</NavLink>
        </li>
        {isAuthenticated ?
            (
              <>
                <li>
                  <NavLink to='/todos' style={navLinkStyle}>Todos</NavLink>
                </li>
                <li>
                  <NavLink to='/profile' style={navLinkStyle}>Profile</NavLink>
                </li>
              </>
            )
            :
              <li>
                <NavLink to='/login' style={navLinkStyle}>Login</NavLink>
              </li>
        }
      </ul>
      { isAuthenticated && <Logoff /> }
    </nav>
  )
}
