import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [form, setForm] = useState({
    tenantName: "",
    email: "",
    password: "",
    roles: "employee",
    allowedApps: "setu,sampada"
  });
  const [error, setError] = useState("");

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await signup({
        tenantName: form.tenantName,
        email: form.email,
        password: form.password,
        roles: form.roles.split(",").map((v) => v.trim()).filter(Boolean),
        allowedApps: form.allowedApps.split(",").map((v) => v.trim()).filter(Boolean)
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Create Account</h1>
        <p>Register your tenant user and access your assigned products.</p>
        <form onSubmit={onSubmit}>
          <label>
            Tenant Name
            <input name="tenantName" value={form.tenantName} onChange={onChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={onChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={onChange} required />
          </label>
          <label>
            Roles (comma separated)
            <input name="roles" value={form.roles} onChange={onChange} />
          </label>
          <label>
            Allowed Apps (comma separated app keys)
            <input name="allowedApps" value={form.allowedApps} onChange={onChange} />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Signup"}
          </button>
        </form>
        <p>
          Already registered? <Link to="/login">Back to login</Link>
        </p>
      </section>
    </main>
  );
};

export default SignupPage;
