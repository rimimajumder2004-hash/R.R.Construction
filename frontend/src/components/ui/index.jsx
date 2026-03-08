import { useEffect } from "react";

// ── Styles injected once ───────────────────────────────────────────────────
const css = `
.btn { display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:8px;font-family:var(--font-cond);font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;transition:all .2s;cursor:pointer; }
.btn-primary { background:var(--orange);color:#fff; }
.btn-primary:hover { background:var(--orange-dim); }
.btn-ghost { background:transparent;color:var(--text-dim);border:1px solid var(--border); }
.btn-ghost:hover { border-color:var(--orange);color:var(--orange); }
.btn-danger { background:rgba(239,68,68,.12);color:var(--red);border:1px solid rgba(239,68,68,.3); }
.btn-danger:hover { background:rgba(239,68,68,.22); }
.btn-sm { padding:6px 12px;font-size:11px; }
.btn:disabled { opacity:.5;cursor:not-allowed; }

.card { background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden; }
.card-header { padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between; }
.card-title { font-family:var(--font-cond);font-size:15px;font-weight:700;letter-spacing:1px;text-transform:uppercase; }
.card-body { padding:20px; }

.badge { display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-family:var(--font-cond);font-weight:700;letter-spacing:.5px;text-transform:uppercase; }
.badge-green  { background:rgba(34,197,94,.12);color:var(--green);border:1px solid rgba(34,197,94,.25); }
.badge-orange { background:rgba(249,115,22,.12);color:var(--orange);border:1px solid rgba(249,115,22,.25); }
.badge-blue   { background:rgba(59,130,246,.12);color:var(--blue);border:1px solid rgba(59,130,246,.25); }
.badge-red    { background:rgba(239,68,68,.12);color:var(--red);border:1px solid rgba(239,68,68,.25); }
.badge-yellow { background:rgba(251,191,36,.12);color:var(--yellow);border:1px solid rgba(251,191,36,.25); }
.badge-gray   { background:rgba(139,148,158,.1);color:var(--text-muted);border:1px solid rgba(139,148,158,.2); }

.form-group { display:flex;flex-direction:column;gap:6px; }
.form-label { font-size:11px;font-family:var(--font-cond);font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted); }
.form-input,.form-select,.form-textarea { background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--text);font-family:var(--font-body);font-size:14px;transition:border-color .2s;outline:none;width:100%; }
.form-input:focus,.form-select:focus,.form-textarea:focus { border-color:var(--orange); }
.form-select { appearance:none; }
.form-textarea { resize:vertical;min-height:80px; }

.table-wrap { overflow-x:auto; }
table { width:100%;border-collapse:collapse; }
thead tr { border-bottom:2px solid var(--border-bright); }
th { padding:11px 14px;text-align:left;font-family:var(--font-cond);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);white-space:nowrap; }
tbody tr { border-bottom:1px solid var(--border);transition:background .15s; }
tbody tr:hover { background:rgba(249,115,22,.04); }
tbody tr:last-child { border-bottom:none; }
td { padding:13px 14px;font-size:14px;vertical-align:middle; }

.progress-wrap { background:var(--border);border-radius:4px;height:5px;overflow:hidden; }
.progress-bar  { height:100%;border-radius:4px;background:var(--orange);transition:width .4s ease; }
.progress-bar.green { background:var(--green); }

.modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease; }
.modal { background:var(--card);border:1px solid var(--border-bright);border-radius:14px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;animation:slideUp .25s ease; }
.modal-lg { max-width:680px; }
.modal-header { padding:18px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--card);z-index:1; }
.modal-title { font-family:var(--font-display);font-size:20px;letter-spacing:1px; }
.modal-body { padding:22px; }
.modal-footer { padding:14px 22px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end; }

.toast { position:fixed;bottom:24px;right:24px;z-index:999;background:var(--card);border:1px solid var(--green);border-radius:10px;padding:13px 18px;display:flex;align-items:center;gap:10px;font-family:var(--font-cond);font-size:13px;font-weight:700;color:var(--green);animation:slideIn .3s ease;box-shadow:0 8px 32px rgba(0,0,0,.4);min-width:240px; }
.toast.error { border-color:var(--red);color:var(--red); }

.stat-card { background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px;position:relative;overflow:hidden;transition:border-color .2s,transform .2s; }
.stat-card:hover { border-color:var(--orange);transform:translateY(-2px); }

.grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:18px; }
.grid-3 { display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px; }
.grid-4 { display:grid;grid-template-columns:repeat(4,1fr);gap:16px; }

.tabs { display:flex;gap:4px;background:var(--bg);padding:4px;border-radius:10px;border:1px solid var(--border);width:fit-content;margin-bottom:18px; }
.tab-btn { padding:7px 16px;border-radius:7px;font-family:var(--font-cond);font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted);border:none;background:transparent;transition:all .2s;cursor:pointer; }
.tab-btn.active { background:var(--orange);color:#fff; }
.tab-btn:hover:not(.active) { color:var(--text); }

.divider { height:1px;background:var(--border);margin:16px 0; }
.flex { display:flex; }
.items-center { align-items:center; }
.justify-between { justify-content:space-between; }
.gap-8 { gap:8px; }
.gap-12 { gap:12px; }
.mb-16 { margin-bottom:16px; }
.mb-24 { margin-bottom:24px; }
.mt-16 { margin-top:16px; }
.text-orange { color:var(--orange); }
.text-muted { color:var(--text-muted); }
.text-green { color:var(--green); }
.text-red { color:var(--red); }
.w-full { width:100%; }
.font-display { font-family:var(--font-display); }
.font-cond { font-family:var(--font-cond); }

.spinner { width:32px;height:32px;border:3px solid var(--border);border-top-color:var(--orange);border-radius:50%;animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.loading-center { display:flex;align-items:center;justify-content:center;min-height:200px; }

@media(max-width:1024px) {
  .grid-4 { grid-template-columns:1fr 1fr; }
  .grid-3 { grid-template-columns:1fr 1fr; }
  .grid-2 { grid-template-columns:1fr; }
}
@media(max-width:640px) {
  .grid-4,.grid-3,.grid-2 { grid-template-columns:1fr; }
}
`;

let injected = false;
export const useUIStyles = () => {
  useEffect(() => {
    if (injected) return;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    injected = true;
  }, []);
};

// ── Components ─────────────────────────────────────────────────────────────
export const Btn = ({ children, variant = "primary", size, onClick, disabled, type = "button", className = "" }) => (
  <button type={type} className={`btn btn-${variant} ${size === "sm" ? "btn-sm" : ""} ${className}`} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

export const Badge = ({ children, color = "gray" }) => (
  <span className={`badge badge-${color}`}>{children}</span>
);

export const StatusBadge = ({ status }) => {
  const map = { "In Progress": "orange", "Completed": "green", "Planning": "blue", "On Hold": "gray",
                "Present": "green", "Absent": "red", "Half Day": "yellow", "Leave": "gray",
                "Paid": "green", "Pending": "yellow", "New": "orange", "Read": "gray", "Replied": "blue" };
  return <Badge color={map[status] || "gray"}>{status}</Badge>;
};

export const Modal = ({ title, onClose, children, footer, lg }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className={`modal ${lg ? "modal-lg" : ""}`}>
      <div className="modal-header">
        <span className="modal-title">{title}</span>
        <Btn variant="ghost" size="sm" onClick={onClose}>✕</Btn>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </div>
  </div>
);

export const Toast = ({ msg, type = "success", onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, []);
  return <div className={`toast ${type === "error" ? "error" : ""}`}>{type === "error" ? "✕" : "✓"} {msg}</div>;
};

export const Spinner = () => <div className="loading-center"><div className="spinner"></div></div>;

export const ProgressBar = ({ value, green }) => (
  <div className="progress-wrap">
    <div className={`progress-bar ${green ? "green" : ""}`} style={{ width: `${value}%` }}></div>
  </div>
);

export const FormGroup = ({ label, children }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    {children}
  </div>
);

export const fmtCurrency = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
export const getToday    = () => new Date().toISOString().split("T")[0];
export const getMonth    = () => new Date().toISOString().slice(0, 7);
