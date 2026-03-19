import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

function AuthPage({ user, authLoading }) {
  const [mode, setMode] = useState('login')

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Авторизація</h1>
      <div className="auth-panel">
        {authLoading ? (
          <p className="auth-message">Перевірка стану авторизації...</p>
        ) : (
          <>
            {!user ? (
              <>
                <h2 className="auth-title">
                  {mode === 'login' ? 'Увійти в акаунт' : 'Створити акаунт'}
                </h2>

                {mode === 'login' ? <LoginForm /> : <RegisterForm />}

                <p className="auth-switch">
                  {mode === 'login' ? 'Немає акаунту?' : 'Вже є акаунт?'}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() =>
                      setMode((prev) => (prev === 'login' ? 'register' : 'login'))
                    }
                  >
                    {mode === 'login' ? 'Зареєструватися' : 'Увійти'}
                  </button>
                </p>
              </>
            ) : (
              <div className="auth-logged-box">
                <button className="btn-logout" type="button" onClick={handleLogout}>
                  Вийти з акаунту
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AuthPage