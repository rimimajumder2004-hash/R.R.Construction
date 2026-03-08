import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/admin",             label: "Dashboard",  icon: "⊞", end: true },
  { to: "/admin/projects",    label: "Projects",   icon: "◈" },
  { to: "/admin/workers",     label: "Workers",    icon: "◉" },
  { to: "/admin/attendance",  label: "Attendance", icon: "◻" },
  { to: "/admin/salary",      label: "Salary",     icon: "◈" },
  { to: "/admin/gallery",     label: "Gallery",    icon: "◫" },
  { to: "/admin/inquiries",   label: "Inquiries",  icon: "◷" },
];

const sideCSS = `
.sidebar { width:230px;min-height:100vh;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;z-index:100; }
.sidebar-logo { padding:22px 18px 18px;border-bottom:1px solid var(--border); }
.logo-mark { display:flex;align-items:center;gap:10px; }
.logo-icon { width:34px;height:34px;background:var(--orange);clip-path:polygon(0 100%,50% 0,100% 100%);flex-shrink:0; }
.logo-name { font-family:var(--font-display);font-size:20px;letter-spacing:2px; }
.logo-sub { font-family:var(--font-cond);font-size:9px;color:var(--text-muted);letter-spacing:3px;text-transform:uppercase;margin-top:1px; }
.sidebar-nav { flex:1;padding:14px 0;overflow-y:auto; }
.nav-section { padding:8px 16px 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);font-family:var(--font-cond);font-weight:600; }
.nav-link { display:flex;align-items:center;gap:11px;padding:9px 18px;font-family:var(--font-cond);font-size:13px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--text-dim);border-left:3px solid transparent;transition:all .2s;text-decoration:none; }
.nav-link:hover { background:var(--orange-glow);color:var(--text); }
.nav-link.active { background:var(--orange-glow);color:var(--orange);border-left-color:var(--orange); }
.sidebar-footer { padding:14px 18px;border-top:1px solid var(--border); }
.admin-pill { display:flex;align-items:center;gap:10px; }
.admin-avatar { width:32px;height:32px;background:var(--orange);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:16px;color:#fff;flex-shrink:0; }
.admin-name { font-family:var(--font-cond);font-size:13px;font-weight:700; }
.admin-role { font-size:11px;color:var(--text-muted); }
.admin-layout { display:flex;min-height:100vh; }
.admin-main { margin-left:230px;flex:1;display:flex;flex-direction:column;min-height:100vh; }
.topbar { height:58px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:50; }
.topbar-title { font-family:var(--font-display);font-size:22px;letter-spacing:2px; }
.page-content { padding:24px;flex:1; }
`;

let sideStyled = false;
import { useEffect } from "react";

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (sideStyled) return;
    const s = document.createElement("style");
    s.textContent = sideCSS;
    document.head.appendChild(s);
    sideStyled = true;
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon"></div>
            <div>
              <div className="logo-name">BUILDCORE</div>
              <div className="logo-sub">Management System</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">Main Menu</div>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <span>{n.icon}</span> {n.label}
            </NavLink>
          ))}
          <div className="nav-section" style={{ marginTop: 12 }}>Site</div>
          <a className="nav-link" href="/" target="_blank">⊕ Public Site</a>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-pill">
            <div className="admin-avatar">{user?.name?.[0] || "A"}</div>
            <div style={{ flex: 1 }}>
              <div className="admin-name">{user?.name || "Admin"}</div>
              <div className="admin-role">{user?.role}</div>
            </div>
            <button onClick={handleLogout} title="Logout" style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 16, cursor: "pointer" }}>⏻</button>
          </div>
        </div>
      </aside>
      <main className="admin-main">
        <div className="topbar">
          <span className="topbar-title">{title}</span>
        </div>
        <div className="page-content slide-up">{children}</div>
      </main>
    </div>
  );
}
