import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "admin@rrconstruction.in", password: "admin123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/admin");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, background: "var(--orange)", clipPath: "polygon(0 100%,50% 0,100% 100%)" }}></div>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 3 }}>R.R.CONSTRUCTION</div>
          <div style={{ fontFamily: "var(--font-cond)", fontSize: 12, letterSpacing: 3, color: "var(--text-muted)", textTransform: "uppercase" }}>Admin Portal</div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              </div>
              {error && <div style={{ color: "var(--red)", fontSize: 13, fontFamily: "var(--font-cond)" }}>✕ {error}</div>}
              <button type="submit" className="btn btn-primary w-full" style={{ padding: "12px", fontSize: 14, justifyContent: "center" }} disabled={loading}>
                {loading ? "Signing in…" : "Sign In to Dashboard"}
              </button>
            </form>
            <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
              Default: admin@rrconstruction.in / admin123
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <a href="/" style={{ color: "var(--orange)", fontFamily: "var(--font-cond)", fontSize: 13, letterSpacing: 1 }}>← Back to Public Site</a>
        </div>
      </div>
    </div>
  );
}
