const AppCard = ({ app, onLaunch, disabled }) => (
  <article className="app-card">
    <h3>{app.name}</h3>
    <p>{app.description}</p>
    <button type="button" onClick={() => onLaunch(app)} disabled={disabled}>
      {disabled ? "No Access" : "Open App"}
    </button>
  </article>
);

export default AppCard;
