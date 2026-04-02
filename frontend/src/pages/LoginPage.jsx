import { useCallback, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { authServerUrl } = useAuth();
  const [email, setEmail] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const iframeRef = useRef(null);

  const openBlackholeAuth = useCallback(
    (e) => {
      e.preventDefault();
      if (!email) return;
      const src =
        authServerUrl +
        "/login?mode=popup&email=" +
        encodeURIComponent(email) +
        "&redirect=" +
        encodeURIComponent(window.location.origin);
      if (iframeRef.current) iframeRef.current.src = src;
      setShowOverlay(true);
    },
    [email, authServerUrl]
  );

  const closeOverlay = useCallback(() => {
    setShowOverlay(false);
    if (iframeRef.current) iframeRef.current.src = "";
  }, []);

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>BHIV Core</h1>
        <p>Sign in with your Blackhole account to access your products.</p>

        <form onSubmit={openBlackholeAuth}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>
          <button type="submit" className="bh-login-btn">
            Continue with Blackhole
          </button>
        </form>
      </section>

      {showOverlay && (
        <div className="bh-overlay" onClick={closeOverlay}>
          <div className="bh-popup" onClick={(e) => e.stopPropagation()}>
            <iframe ref={iframeRef} title="Blackhole Auth" className="bh-iframe" />
            <button className="bh-close" onClick={closeOverlay} type="button">
              &times;
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default LoginPage;
