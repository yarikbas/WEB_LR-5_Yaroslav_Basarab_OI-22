import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const MAX_REVIEW_LENGTH = 1000

function ReviewSection({ user }) {
  const [reviews, setReviews] = useState([])
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState('5')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState('success')
  const [readError, setReadError] = useState('')

  useEffect(() => {
    if (!user) {
      setReviews([])
      setReadError('')
      return undefined
    }

    const reviewsQuery = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc'),
    )

    const unsubscribe = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setReviews(data)
        setReadError('')
      },
      (firebaseError) => {
        setReadError(firebaseError.message)
      },
    )

    return () => unsubscribe()
  }, [user])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!user) {
      setFeedback('Лише авторизовані користувачі можуть залишати відгуки.')
      setFeedbackType('error')
      return
    }

    if (!reviewText.trim()) {
      setFeedback('Введіть текст відгуку.')
      setFeedbackType('error')
      return
    }

    if (reviewText.trim().length > MAX_REVIEW_LENGTH) {
      setFeedback(`Відгук має містити не більше ${MAX_REVIEW_LENGTH} символів.`)
      setFeedbackType('error')
      return
    }

    setLoading(true)
    setFeedback('')

    try {
      await addDoc(collection(db, 'reviews'), {
        userEmail: user.email,
        userId: user.uid,
        text: reviewText.trim(),
        rating: Number(rating),
        createdAt: serverTimestamp(),
      })

      setReviewText('')
      setRating('5')
      setFeedback('Відгук успішно додано.')
      setFeedbackType('success')
    } catch (error) {
      setFeedback(`Помилка збереження відгуку: ${error.message}`)
      setFeedbackType('error')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (createdAt) => {
    if (!createdAt?.toDate) {
      return 'щойно'
    }

    return createdAt.toDate().toLocaleString('uk-UA')
  }

  const maskEmail = (email) => {
    if (!email || typeof email !== 'string') {
      return 'Анонім'
    }

    const [namePart, domainPart] = email.split('@')

    if (!namePart || !domainPart) {
      return 'Анонім'
    }

    if (namePart.length <= 2) {
      return `${namePart[0] || '*'}***@${domainPart}`
    }

    return `${namePart.slice(0, 2)}***@${domainPart}`
  }

  return (
    <div className="review-section-card">
      <div className="review-topline">
        <p className="status-note">
          {user
            ? `Авторизований користувач: ${user.email}`
            : 'Увійдіть у систему, щоб читати та залишати відгуки.'}
        </p>
      </div>

      <form className="review-form" onSubmit={handleSubmit}>
        <label>
          Ваш відгук
          <textarea
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            placeholder="Поділіться враженнями про ресторан"
            rows={5}
            maxLength={MAX_REVIEW_LENGTH}
            disabled={!user || loading}
          />
          <small className="helper-note">
            {reviewText.length}/{MAX_REVIEW_LENGTH}
          </small>
        </label>

        <label>
          Оцінка
          <select
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            disabled={!user || loading}
          >
            <option value="5">5 / 5</option>
            <option value="4">4 / 5</option>
            <option value="3">3 / 5</option>
            <option value="2">2 / 5</option>
            <option value="1">1 / 5</option>
          </select>
        </label>

        <div className="review-actions">
          <button className="btn-review" type="submit" disabled={!user || loading}>
            {loading ? 'Збереження...' : 'Додати відгук'}
          </button>
        </div>
      </form>

      {feedback ? <p className={`review-feedback ${feedbackType}`}>{feedback}</p> : null}

      {!user ? (
        <p className="helper-note">Авторизуйтесь, щоб переглянути список відгуків.</p>
      ) : null}

      {user && readError ? (
        <p className="review-feedback error">
          Помилка читання колекції `reviews`: {readError}
        </p>
      ) : null}

      <div className="review-list">
        {user && !readError && reviews.length === 0 ? (
          <p className="empty-note">Поки що немає жодного відгуку.</p>
        ) : null}

        {user && reviews.map((review) => (
          <article className="review-item" key={review.id}>
            <div className="review-item-header">
              <span className="review-user">{maskEmail(review.userEmail)}</span>
              <span className="review-meta">
                Оцінка: {review.rating || '—'}/5 · {formatDate(review.createdAt)}
              </span>
            </div>
            <p>{review.text || 'Без тексту відгуку'}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ReviewSection