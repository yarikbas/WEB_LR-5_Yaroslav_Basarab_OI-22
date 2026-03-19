import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/menu" className="navbar-brand">
        🍽 Годівничка
      </NavLink>
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/menu"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Меню
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/chefs"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Кухарі
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Про нас
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/auth"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Авторизація
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
