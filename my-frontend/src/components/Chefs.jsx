import chefs from '../data/chefs';

function Chefs() {
  return (
    <div className="page">
      <h1 className="page-title">Наші кухарі</h1>
      <p className="chefs-intro">
        Годівничка — це їдальня Львівської політехніки, де працюють досвідчені
        кухарі, які щодня готують смачні та корисні страви для студентів і
        викладачів університету.
      </p>
      <div className="chefs-grid">
        {chefs.map((chef) => (
          <div className="chef-card" key={chef.id}>
            <img src={chef.image} alt={chef.name} />
            <h3>{chef.name}</h3>
            <p>{chef.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chefs;
