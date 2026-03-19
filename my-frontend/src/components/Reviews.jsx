import { useEffect, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function Reviews({ user }) {
  const [reviews, setReviews] = useState([])
  const [text, setText] = useState('')
  const [rating, setRating] = useState('5')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [loading, setLoading] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    const loadReviews = async () => {
      setReviewsLoading(true)

      try {
        const response = await fetch(`${API_BASE_URL}/api/reviews`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Не вдалося завантажити відгуки.')
        }

        setReviews(Array.isArray(data.items) ? data.items : [])
      } catch (error) {
        setMessage(`Помилка читання reviews: ${error.message}`)
        setMessageType('error')
      } finally {
        setReviewsLoading(false)
      }
    }

    loadReviews()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!user) {
      setMessage('Щоб залишати відгуки, потрібно увійти в систему.')
      setMessageType('error')
      return
    }

    if (!text.trim()) {
      setMessage('Введіть текст відгуку.')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          rating: Number(rating),
          userEmail: user.email,
          userId: user.uid,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Помилка збереження відгуку.')
      }

      const createdReview = data.item || {
        id: crypto.randomUUID(),
        userEmail: user.email,
        userId: user.uid,
        text: text.trim(),
        rating: Number(rating),
        createdAt: new Date().toISOString(),
      }

      setReviews((prevReviews) => [createdReview, ...prevReviews])

      setText('')
      setRating('5')
      setMessage('Відгук додано.')
      setMessageType('success')
    } catch (error) {
      setMessage(`Помилка збереження: ${error.message}`)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (createdAt) => {
    if (!createdAt) {
      return 'щойно'
    }

    const parsed = new Date(createdAt)
    if (Number.isNaN(parsed.getTime())) {
      return 'щойно'
    }

    return parsed.toLocaleString('uk-UA')
  }

  return (
    <div className="reviews-section">
      <h2 className="reviews-title">Відгуки</h2>

      {!user ? (
        <p className="reviews-note">
          Щоб залишити відгук, спочатку увійдіть на вкладці «Авторизація».
        </p>
      ) : (
        <>
          <p className="reviews-note">Ви увійшли як: {user.email}</p>

          <form className="reviews-form" onSubmit={handleSubmit}>
            <textarea
              rows={4}
              placeholder="Ваш відгук..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={1000}
              required
            />
            <select
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            >
              <option value="5">5 / 5</option>
              <option value="4">4 / 5</option>
              <option value="3">3 / 5</option>
              <option value="2">2 / 5</option>
              <option value="1">1 / 5</option>
            </select>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Збереження...' : 'Надіслати відгук'}
            </button>
          </form>
        </>
      )}

      {message ? <p className={`reviews-${messageType}`}>{message}</p> : null}

      <div className="review-cards">
        {reviewsLoading ? <p className="reviews-note">Завантаження відгуків...</p> : null}

        {reviews.map((review) => (
          <div className="review-card" key={review.id}>
            <div className="review-card-header">
              <span className="review-card-name">{review.userEmail}</span>
              <span className="review-card-date">
                Оцінка: {review.rating || '-'} · {formatDate(review.createdAt)}
              </span>
            </div>
            <p className="review-card-text">{review.text}</p>
          </div>
        ))}

        {reviews.length === 0 ? (
          <p className="reviews-note">Поки що відгуків немає.</p>
        ) : null}
      </div>
    </div>
  )
}

export default Reviews