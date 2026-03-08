import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { projectAPI } from "../../api/services";
import { Btn, Modal, StatusBadge, ProgressBar, Toast, Spinner, FormGroup, fmtCurrency } from "../../components/ui";

const BLANK = { name: "", location: "", description: "", startDate: "", status: "Planning", completion: 0, budget: "" };

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState(BLANK);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState(null);

  const load = () => projectAPI.getAll().then(r => setProjects(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const openAdd  = () => { setForm(BLANK); setModal("add"); };
  const openEdit = (p) => { setForm({ ...p, budget: p.budget }); setModal(p._id); };

  const save = async () => {
    if (!form.name || !form.location || !form.startDate) { showToast("Fill required fields", "error"); return; }
    setSaving(true);
    try {
      const body = { ...form, completion: Number(form.completion), budget: Number(form.budget) };
      if (modal === "add") { await projectAPI.create(body); showToast("Project created"); }
      else                 { await projectAPI.update(modal, body); showToast("Project updated"); }
      setModal(null);
      load();
    } catch { showToast("Something went wrong", "error"); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete this project?")) return;
    await projectAPI.remove(id);
    showToast("Project deleted");
    load();
  };

  if (loading) return <AdminLayout title="Projects"><Spinner /></AdminLayout>;

  return (
    <AdminLayout title="Projects">
      <div className="flex justify-between items-center mb-24">
        <div>
          <div style={{ fontFamily: "var(--font-cond)", fontSize: 11, letterSpacing: 3, color: "var(--orange)", textTransform: "uppercase" }}>Construction Management</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, letterSpacing: 2 }}>{projects.length} Projects</div>
        </div>
        <Btn onClick={openAdd}>+ New Project</Btn>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Project</th><th>Location</th><th>Start Date</th><th>Budget</th><th>Progress</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {projects.map(p => (
                <tr key={p._id}>
                  <td>
                    <div style={{ fontFamily: "var(--font-cond)", fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{p.description?.slice(0, 50)}…</div>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--text-dim)" }}>📍 {p.location}</td>
                  <td style={{ fontSize: 13 }}>{p.startDate}</td>
                  <td style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--yellow)" }}>{fmtCurrency(p.budget)}</td>
                  <td style={{ minWidth: 130 }}>
                    <div className="flex items-center gap-8">
                      <div style={{ flex: 1 }}><ProgressBar value={p.completion} green={p.completion === 100} /></div>
                      <span style={{ fontSize: 12, color: "var(--orange)", fontFamily: "var(--font-display)", minWidth: 30 }}>{p.completion}%</span>
                    </div>
                  </td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    <div className="flex gap-8">
                      <Btn variant="ghost" size="sm" onClick={() => openEdit(p)}>Edit</Btn>
                      <Btn variant="danger" size="sm" onClick={() => del(p._id)}>Del</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === "add" ? "New Project" : "Edit Project"} onClose={() => setModal(null)} lg
          footer={<><Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn><Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Project"}</Btn></>}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["Project Name *", "name", "text"], ["Location *", "location", "text"], ["Start Date *", "startDate", "date"], ["Budget (₹)", "budget", "number"]].map(([lbl, key, type]) => (
              <FormGroup key={key} label={lbl}>
                <input className="form-input" type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </FormGroup>
            ))}
            <FormGroup label="Status">
              <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {["Planning","In Progress","Completed","On Hold"].map(s => <option key={s}>{s}</option>)}
              </select>
            </FormGroup>
            <FormGroup label={`Completion: ${form.completion}%`}>
              <input type="range" min="0" max="100" value={form.completion} onChange={e => setForm(f => ({ ...f, completion: e.target.value }))}
                style={{ width: "100%", accentColor: "var(--orange)", cursor: "pointer" }} />
            </FormGroup>
            <div style={{ gridColumn: "1/-1" }}>
              <FormGroup label="Description">
                <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </FormGroup>
            </div>
          </div>
        </Modal>
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </AdminLayout>
  );
}
