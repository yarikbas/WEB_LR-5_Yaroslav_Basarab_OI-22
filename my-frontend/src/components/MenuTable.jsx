import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

function MenuTable() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const menuQuery = query(collection(db, 'menu'), orderBy('price', 'asc'))

    const unsubscribe = onSnapshot(
      menuQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setMenuItems(items)
        setLoading(false)
        setError('')
      },
      (firebaseError) => {
        setError(firebaseError.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  return (
    <div className="menu-table-card">
      {loading ? <p className="helper-note">Завантаження меню з Firestore...</p> : null}

      {!loading && error ? (
        <p className="menu-feedback error">Помилка читання колекції `menu`: {error}</p>
      ) : null}

      {!loading && !error && menuItems.length === 0 ? (
        <p className="empty-note">
          Колекція `menu` поки порожня. Додай документи в Firestore, щоб меню
          відобразилось на сайті.
        </p>
      ) : null}

      {!loading && !error && menuItems.length > 0 ? (
        <div className="table-scroll">
          <table className="fire-menu-table">
            <thead>
              <tr>
                <th>Страва</th>
                <th>Категорія</th>
                <th>Опис</th>
                <th>Ціна</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id}>
                  <td className="menu-name">{item.name || 'Без назви'}</td>
                  <td>{item.category || '—'}</td>
                  <td>{item.description || '—'}</td>
                  <td className="menu-price">
                    {item.price !== undefined && item.price !== null
                      ? `${item.price} грн`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

export default MenuTable