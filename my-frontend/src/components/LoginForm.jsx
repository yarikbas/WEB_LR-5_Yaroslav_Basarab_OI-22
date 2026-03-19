import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setMessage('Вхід успішний.')
      setMessageType('success')
      setPassword('')
    } catch (error) {
      setMessage(`Помилка входу: ${error.message}`)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth-form-grid" onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label>
        Пароль
        <input
          type="password"
          placeholder="Введіть пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      <div className="auth-actions">
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Обробка...' : 'Увійти'}
        </button>
      </div>

      {message ? <p className={`auth-message ${messageType}`}>{message}</p> : null}
    </form>
  )
}

export default LoginForm
