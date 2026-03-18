import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import AppCard from "../components/AppCard";
import Spinner from "../components/Spinner";
import { ALL_APPS } from "../constants/apps";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user, logout, fetchMe } = useAuth();
  const navigate = useNavigate();
  const [launchingKey, setLaunchingKey] = useState("");
  const [error, setError] = useState("");

  const allowedSet = useMemo(() => new Set((user?.allowedApps || []).map((v) => v.toLowerCase())), [user]);
  const visibleApps = useMemo(() => ALL_APPS.filter((app) => allowedSet.has(app.key)), [allowedSet]);
  const isAdmin = user?.roles?.includes("admin");

  const launchApp = async (app) => {
    setError("");
    setLaunchingKey(app.key);
    try {
      const sessionUser = await fetchMe();
      if (!sessionUser) {
        navigate("/login");
        return;
      }
      if (!sessionUser.allowedApps?.includes(app.key)) {
        setError(`Access denied: ${app.name} is not in your allowed app list.`);
        return;
      }
      window.location.href = app.url;
    } catch {
      navigate("/login");
    } finally {
      setLaunchingKey("");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return <Spinner label="Loading dashboard..." />;

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <h1>Welcome, {user.email}</h1>
          <p>
            Tenant: <strong>{String(user.tenant_id)}</strong>
          </p>
          {isAdmin ? <span className="pill">Admin View</span> : <span className="pill secondary">Standard User</span>}
        </div>
        <div className="header-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
          <button type="button" onClick={handleLogout}>
            Logout from all apps
          </button>
        </div>
      </header>

      {error ? <p className="error-text">{error}</p> : null}

      <section>
        <h2>Product Launcher</h2>
        <p>Select an app to continue with single sign-on.</p>
      </section>

      <section className="app-grid">
        {ALL_APPS.map((app) => {
          const disabled = !allowedSet.has(app.key);
          return (
            <AppCard
              key={app.key}
              app={app}
              onLaunch={launchApp}
              disabled={disabled || launchingKey.length > 0}
            />
          );
        })}
      </section>

      {visibleApps.length === 0 ? (
        <p className="empty-state">No apps assigned to your user yet. Contact your tenant admin.</p>
      ) : null}
    </main>
  );
};

export default DashboardPage;
