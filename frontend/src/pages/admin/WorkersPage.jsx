import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { workerAPI, projectAPI } from "../../api/services";
import { Btn, Modal, Toast, Spinner, FormGroup, fmtCurrency, getToday } from "../../components/ui";

const BLANK = { name: "", role: "", phone: "", email: "", dailyWage: "", project: "", joinDate: getToday(), isActive: true };

export default function WorkersPage() {
  const [workers,  setWorkers]  = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState(BLANK);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState(null);
  const [viewMode, setViewMode] = useState("table");

  const load = async () => {
    const [w, p] = await Promise.all([workerAPI.getAll(), projectAPI.getAll()]);
    setWorkers(w.data.data);
    setProjects(p.data.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const save = async () => {
    if (!form.name || !form.role || !form.dailyWage) { showToast("Fill required fields", "error"); return; }
    setSaving(true);
    try {
      const body = { ...form, dailyWage: Number(form.dailyWage) };
      if (modal === "add") { await workerAPI.create(body); showToast("Worker added"); }
      else                 { await workerAPI.update(modal, body); showToast("Worker updated"); }
      setModal(null); load();
    } catch { showToast("Error saving worker", "error"); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm("Remove this worker?")) return;
    await workerAPI.remove(id);
    showToast("Worker removed"); load();
  };

  if (loading) return <AdminLayout title="Workers"><Spinner /></AdminLayout>;

  return (
    <AdminLayout title="Workers">
      <div className="flex justify-between items-center mb-24">
        <div>
          <div style={{ fontFamily: "var(--font-cond)", fontSize: 11, letterSpacing: 3, color: "var(--orange)", textTransform: "uppercase" }}>HR Module</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, letterSpacing: 2 }}>{workers.length} Workers</div>
        </div>
        <div className="flex gap-8">
          <div className="tabs" style={{ marginBottom: 0 }}>
            {["table","grid"].map(v => <button key={v} className={`tab-btn ${viewMode===v?"active":""}`} onClick={() => setViewMode(v)}>{v}</button>)}
          </div>
          <Btn onClick={() => { setForm(BLANK); setModal("add"); }}>+ Add Worker</Btn>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Worker</th><th>Role</th><th>Phone</th><th>Daily Wage</th><th>Project</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {workers.map(w => (
                  <tr key={w._id}>
                    <td>
                      <div className="flex items-center gap-8">
                        <div style={{ width:36,height:36,borderRadius:"50%",background:"var(--orange-glow)",border:"1px solid var(--orange)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-display)",fontSize:16,color:"var(--orange)",flexShrink:0 }}>{w.name[0]}</div>
                        <div><div style={{ fontFamily:"var(--font-cond)",fontWeight:700 }}>{w.name}</div><div style={{ fontSize:12,color:"var(--text-muted)" }}>{w.email}</div></div>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{w.role}</span></td>
                    <td style={{ fontSize:13 }}>{w.phone}</td>
                    <td style={{ fontFamily:"var(--font-display)",fontSize:20,color:"var(--orange)" }}>{fmtCurrency(w.dailyWage)}</td>
                    <td style={{ fontSize:13,color:"var(--text-dim)" }}>{w.project?.name || "—"}</td>
                    <td style={{ fontSize:12,color:"var(--text-muted)" }}>{w.joinDate}</td>
                    <td><div className="flex gap-8"><Btn variant="ghost" size="sm" onClick={() => { setForm({ ...w, project: w.project?._id || "" }); setModal(w._id); }}>Edit</Btn><Btn variant="danger" size="sm" onClick={() => del(w._id)}>Del</Btn></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {workers.map(w => (
            <div key={w._id} className="card">
              <div className="card-body">
                <div className="flex items-center gap-12 mb-16">
                  <div style={{ width:48,height:48,borderRadius:"50%",background:"var(--orange-glow)",border:"2px solid var(--orange)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-display)",fontSize:22,color:"var(--orange)" }}>{w.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"var(--font-cond)",fontWeight:700,fontSize:16 }}>{w.name}</div>
                    <div style={{ fontSize:11,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:1 }}>{w.role}</div>
                  </div>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between mb-16" style={{ marginTop:12 }}>
                  <div><div style={{ fontFamily:"var(--font-display)",fontSize:22,color:"var(--orange)" }}>{fmtCurrency(w.dailyWage)}</div><div style={{ fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:1 }}>Daily Wage</div></div>
                  <div style={{ textAlign:"right" }}><div style={{ fontSize:13,color:"var(--text-dim)",fontFamily:"var(--font-cond)" }}>{w.project?.name||"—"}</div><div style={{ fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:1 }}>Project</div></div>
                </div>
                <div style={{ fontSize:12,color:"var(--text-muted)",marginBottom:12 }}>📞 {w.phone}</div>
                <div className="flex gap-8">
                  <Btn variant="ghost" size="sm" onClick={() => { setForm({ ...w, project: w.project?._id||"" }); setModal(w._id); }}>Edit</Btn>
                  <Btn variant="danger" size="sm" onClick={() => del(w._id)}>Remove</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal==="add"?"Add Worker":"Edit Worker"} onClose={() => setModal(null)} lg
          footer={<><Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn><Btn onClick={save} disabled={saving}>{saving?"Saving…":"Save Worker"}</Btn></>}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            {[["Full Name *","name","text"],["Role *","role","text"],["Phone","phone","tel"],["Email","email","email"],["Daily Wage (₹) *","dailyWage","number"],["Join Date","joinDate","date"]].map(([lbl,key,type]) => (
              <FormGroup key={key} label={lbl}><input className="form-input" type={type} value={form[key]} onChange={e => setForm(f => ({ ...f,[key]:e.target.value }))} /></FormGroup>
            ))}
            <div style={{ gridColumn:"1/-1" }}>
              <FormGroup label="Assign to Project">
                <select className="form-select" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))}>
                  <option value="">— No Project —</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </FormGroup>
            </div>
          </div>
        </Modal>
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </AdminLayout>
  );
}
