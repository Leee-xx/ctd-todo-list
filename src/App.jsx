import './App.css'
import Header from './shared/Header.jsx'
import TodosPage from './features/Todos/TodosPage.jsx'
import Logon from './features/Logon.jsx'
import Logoff from './features/Logoff.jsx'
import { useAuth } from './contexts/AuthContext.jsx'

function App() {
  const { isAuthenticated } = useAuth()

  return(
    <>
      <Header />
      {
        isAuthenticated ? (
          <div>
            <Logoff />
            <TodosPage />
          </div>
        ) : (
          <Logon />
        )
      }
    </>
  )
}

export default App
