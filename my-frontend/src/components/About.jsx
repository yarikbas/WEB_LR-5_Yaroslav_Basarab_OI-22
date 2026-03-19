import Reviews from './Reviews'

function About({ user }) {
  return (
    <div className="page">
      <h1 className="page-title">Про нас</h1>

      <p className="about-description">
        Годівничка — це студентська їдальня Національного університету
        «Львівська політехніка», яка знаходиться за адресою вул. Степана
        Бандери, 12, Львів. Ми працюємо щоденно та пропонуємо великий вибір
        традиційних українських страв за доступними цінами.
      </p>
      <p className="about-description">
        Наша місія — забезпечити смачне та корисне харчування для студентів,
        викладачів та працівників університету. Ми використовуємо лише свіжі
        продукти від перевірених постачальників.
      </p>
      <p className="about-description">
        Завітайте до нас — і переконайтесь, що смачна домашня їжа може бути
        доступною та швидкою!
      </p>

      <h2 className="reviews-title">Наші переваги</h2>
      <ul className="about-advantages">
        <li>Доступні ціни для студентів</li>
        <li>Великий вибір страв щодня</li>
        <li>Досвідчені кухарі з любов'ю до справи</li>
        <li>Швидке обслуговування без черг</li>
      </ul>

      <div className="map-wrapper">
        <iframe
          title="Місцезнаходження"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2573.391!2d24.0163!3d49.8417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473add6f6c8fba59%3A0x61d85b9fa1a16b89!2z0JvRjNCy0ZbQstGB0YzQutCwINC_0L7Qu9GW0YLQtdGF0L3RltC60LA!5e0!3m2!1suk!2sua!4v1700000000000"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <Reviews user={user} />
    </div>
  )
}

export default About
