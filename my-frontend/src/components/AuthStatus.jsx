import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

function AuthStatus({ user }) {
  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!user) {
    return (
      <div className="auth-status-box">
        <p className="status-note">Користувач не авторизований.</p>
      </div>
    )
  }

  return (
    <div className="auth-status-box">
      <div>
        <p className="status-note">Статус: авторизований</p>
        <p className="auth-status-email">{user.email}</p>
      </div>
      <button className="btn-logout" type="button" onClick={handleLogout}>
        Вийти
      </button>
    </div>
  )
}

export default AuthStatus