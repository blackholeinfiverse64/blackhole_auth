const Spinner = ({ label = "Loading..." }) => (
  <div className="spinner-wrap">
    <div className="spinner" />
    <p>{label}</p>
  </div>
);

export default Spinner;
