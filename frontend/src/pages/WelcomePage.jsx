import { Link } from "react-router-dom";

const WelcomePage = () => (
  <main className="auth-shell">
    <section className="auth-card">
      <h1>Welcome to BHIV Core</h1>
      <p>Identity and product launcher for all Blackhole Infiverse applications.</p>
      <div className="header-actions">
        <Link to="/login">
          <button type="button">Login</button>
        </Link>
        <Link to="/signup">
          <button type="button" className="secondary-btn">
            Signup
          </button>
        </Link>
      </div>
    </section>
  </main>
);

export default WelcomePage;
