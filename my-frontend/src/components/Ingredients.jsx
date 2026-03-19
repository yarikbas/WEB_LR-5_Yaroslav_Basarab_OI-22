function Ingredients({ items = [] }) {
  return (
    <ul className="ingredients-list">
      {items.map((ingredient) => (
        <li key={ingredient}>{ingredient}</li>
      ))}
    </ul>
  )
}

export default Ingredients