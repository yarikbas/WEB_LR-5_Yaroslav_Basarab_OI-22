import { Fragment, useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import MenuItem from './MenuItem'

function Menu() {
  const [menuItems, setMenuItems] = useState([])
  const [sortOrder, setSortOrder] = useState('asc')
  const [openRow, setOpenRow] = useState(null)
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

  const sorted = [...menuItems].sort((a, b) =>
    sortOrder === 'asc' ? a.price - b.price : b.price - a.price,
  )

  const toggleSort = () =>
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))

  const toggleRow = (id) =>
    setOpenRow((prev) => (prev === id ? null : id))

  return (
    <div className="page">
      <h1 className="page-title">Меню</h1>
      <div className="menu-controls">
        <button className="btn-sort" onClick={toggleSort}>
          Сортувати за ціною:{' '}
          {sortOrder === 'asc' ? '↑ Зростання' : '↓ Спадання'}
        </button>
      </div>

      {!loading && !error && sorted.length > 0 ? (
        <div className="menu-grid">
          {sorted.map((item) => (
            <MenuItem key={`card-${item.id}`} item={item} />
          ))}
        </div>
      ) : null}

      <h2 className="table-title">Прайс-лист</h2>

      {loading ? <p className="menu-note">Завантаження меню з Firestore...</p> : null}
      {error ? <p className="menu-error">Помилка читання `menu`: {error}</p> : null}
      {!loading && !error && sorted.length === 0 ? (
        <p className="menu-note">Колекція `menu` порожня. Додай страви у Firestore.</p>
      ) : null}

      <div className="price-table-wrapper">
        <table className="price-table">
          <thead>
            <tr>
              <th>Страва</th>
              <th>Ціна</th>
              <th>Інгредієнти</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <Fragment key={item.id}>
                <tr className="price-table-row">
                  <td>{item.name}</td>
                  <td className="price-cell">
                    {item.price !== undefined && item.price !== null
                      ? `${item.price} грн`
                      : '—'}
                  </td>
                  <td>
                    <button
                      className="btn-ingredients"
                      onClick={() => toggleRow(item.id)}
                    >
                      {openRow === item.id ? 'Сховати ▲' : 'Показати ▼'}
                    </button>
                  </td>
                </tr>

                {openRow === item.id && Array.isArray(item.ingredients) ? (
                  <tr className="ingredients-row">
                    <td colSpan={3}>
                      <ul className="ingredients-list">
                        {item.ingredients.map((ingredient) => (
                          <li key={ingredient}>{ingredient}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Menu