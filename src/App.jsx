import { Routes, Route } from 'react-router'
import Container from 'react-bootstrap/Container';
import './App.scss'
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import TodosPage from './pages/TodosPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import RequireAuth from './components/RequireAuth'
import Header from './shared/Header.jsx'

function App() {
  return(
    <Container fluid='md' id='todo-app'>
      <Header />
      <Routes>
        <Route path='/'
          element={<HomePage />}
        />
        <Route path='/about'
          element={<AboutPage />}
        />
        <Route path='/login'
          element={<LoginPage />}
        />
        <Route path='/todos'
          element={
            <RequireAuth>
              <TodosPage />
            </RequireAuth>
          }
        />
        <Route path='/profile'
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route path='*'
          element={<NotFoundPage />}
        />
      </Routes>
    </Container>
  )
}

export default App
