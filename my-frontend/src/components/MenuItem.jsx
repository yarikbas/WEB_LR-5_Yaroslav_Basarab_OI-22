import { useState } from 'react'
import Ingredients from './Ingredients'

function MenuItem({ item }) {
  const [showIngredients, setShowIngredients] = useState(false)
  const hasIngredients = Array.isArray(item.ingredients) && item.ingredients.length > 0

  return (
    <article className="menu-card">
      <img src={item.image} alt={item.name} />
      <div className="menu-card-body">
        <h3 className="menu-card-name">{item.name}</h3>
        <p className="menu-card-price">{item.price} грн</p>
        {hasIngredients ? (
          <>
            <button
              className="btn-ingredients"
              onClick={() => setShowIngredients((prev) => !prev)}
            >
              {showIngredients ? 'Сховати інгредієнти' : 'Показати інгредієнти'}
            </button>
            {showIngredients ? <Ingredients items={item.ingredients} /> : null}
          </>
        ) : null}
      </div>
    </article>
  )
}

export default MenuItem