function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h3 className="footer-brand">🍽 Годівничка</h3>
          <p>Студентська їдальня Львівської політехніки</p>
        </div>
        <div className="footer-col">
          <h4>Контакти</h4>
          <p>📍 вул. Степана Бандери, 12, Львів, 79000</p>
          <p>📞 <a href="tel:+380322582111">+38 (032) 258-21-11</a></p>
          <p>✉️ <a href="mailto:info@hodivnychka.lviv.ua">info@hodivnychka.lviv.ua</a></p>
        </div>
        <div className="footer-col">
          <h4>Навігація</h4>
          <p><a href="/menu">Меню</a></p>
          <p><a href="/chefs">Кухарі</a></p>
          <p><a href="/about">Про нас</a></p>
          <p><a href="/auth">Авторизація</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Годівничка. Всі права захищені.</p>
      </div>
    </footer>
  )
}

export default Footer
