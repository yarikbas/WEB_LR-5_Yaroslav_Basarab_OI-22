import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

function RegisterForm() {
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
      await createUserWithEmailAndPassword(auth, email, password)
      setMessage('Реєстрація успішна. Тепер увійдіть у акаунт.')
      setMessageType('success')
      setPassword('')
    } catch (error) {
      setMessage(`Помилка реєстрації: ${error.message}`)
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
          placeholder="Мінімум 6 символів"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
        />
      </label>

      <div className="auth-actions">
        <button className="btn-secondary" type="submit" disabled={loading}>
          {loading ? 'Обробка...' : 'Створити акаунт'}
        </button>
      </div>

      {message ? <p className={`auth-message ${messageType}`}>{message}</p> : null}
    </form>
  )
}

export default RegisterForm
