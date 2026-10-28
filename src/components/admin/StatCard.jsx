// Small KPI tile: icon, label, value. tone = red | blue | green | amber | purple.
function StatCard({ icon: Icon, label, value, tone = "red" }) {

  return (

    <div className={`admin-stat-card ${tone}`}>

      <div className="admin-stat-icon" aria-hidden="true">
        <Icon />
      </div>

      <div className="admin-stat-body">
        <p>{label}</p>
        <h3>{value}</h3>
      </div>

    </div>

  );

}

export default StatCard;
