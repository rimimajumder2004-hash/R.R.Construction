// GalleryPage.jsx
import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { galleryAPI, projectAPI } from "../../api/services";
import { Btn, Modal, Toast, Spinner, FormGroup } from "../../components/ui";

export function GalleryPage() {
  const [images,   setImages]   = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState({ title:"",imageUrl:"",phase:"Ongoing",project:"",caption:"",isPublic:true });
  const [toast,    setToast]    = useState(null);
  const [filter,   setFilter]   = useState("All");

  const load = async () => {
    const [g, p] = await Promise.all([galleryAPI.getAll(), projectAPI.getAll()]);
    setImages(g.data.data); setProjects(p.data.data); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title || !form.imageUrl) { setToast({ msg:"Fill required fields",type:"error" }); return; }
    await galleryAPI.create(form);
    setToast({ msg:"Image added to gallery" }); setModal(false); load();
  };

  const del = async (id) => {
    if (!confirm("Remove this image?")) return;
    await galleryAPI.remove(id); setToast({ msg:"Image removed" }); load();
  };

  const phases = ["All","Foundation","Structure","Finishing","Completed","Ongoing"];
  const filtered = filter==="All" ? images : images.filter(i => i.phase===filter);

  if (loading) return <AdminLayout title="Gallery"><Spinner /></AdminLayout>;

  return (
    <AdminLayout title="Gallery">
      <div className="flex justify-between items-center mb-24">
        <div>
          <div style={{ fontFamily:"var(--font-cond)",fontSize:11,letterSpacing:3,color:"var(--orange)",textTransform:"uppercase" }}>Visual Records</div>
          <div style={{ fontFamily:"var(--font-display)",fontSize:26,letterSpacing:2 }}>Site Gallery</div>
        </div>
        <Btn onClick={() => setModal(true)}>+ Add Image</Btn>
      </div>
      <div className="tabs">
        {phases.map(p => <button key={p} className={`tab-btn ${filter===p?"active":""}`} onClick={() => setFilter(p)}>{p}</button>)}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
        {filtered.map(img => (
          <div key={img._id} style={{ position:"relative",borderRadius:10,overflow:"hidden",aspectRatio:"16/11",cursor:"pointer" }}>
            <img src={img.imageUrl} alt={img.title} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 55%)",display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:12 }}>
              <div>
                <div style={{ fontFamily:"var(--font-cond)",fontSize:14,fontWeight:700,letterSpacing:1 }}>{img.title}</div>
                <div style={{ fontSize:12,color:"rgba(255,255,255,.7)",marginTop:2 }}>{img.project?.name} · {img.phase}</div>
              </div>
              <button onClick={() => del(img._id)} style={{ background:"rgba(239,68,68,.8)",border:"none",color:"#fff",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:14 }}>✕</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title="Add Gallery Image" onClose={() => setModal(false)}
          footer={<><Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn><Btn onClick={save}>Add Image</Btn></>}>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <FormGroup label="Title *"><input className="form-input" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} /></FormGroup>
            <FormGroup label="Image URL *"><input className="form-input" value={form.imageUrl} onChange={e => setForm(f=>({...f,imageUrl:e.target.value}))} placeholder="https://..." /></FormGroup>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              <FormGroup label="Phase">
                <select className="form-select" value={form.phase} onChange={e => setForm(f=>({...f,phase:e.target.value}))}>
                  {["Foundation","Structure","Finishing","Completed","Ongoing"].map(p=><option key={p}>{p}</option>)}
                </select>
              </FormGroup>
              <FormGroup label="Project">
                <select className="form-select" value={form.project} onChange={e => setForm(f=>({...f,project:e.target.value}))}>
                  <option value="">— None —</option>
                  {projects.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </FormGroup>
            </div>
            <FormGroup label="Caption"><input className="form-input" value={form.caption} onChange={e => setForm(f=>({...f,caption:e.target.value}))} /></FormGroup>
          </div>
        </Modal>
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </AdminLayout>
  );
}

// InquiriesPage.jsx
import { inquiryAPI } from "../../api/services";
import { StatusBadge } from "../../components/ui";

export function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(null);
  const [toast,     setToast]     = useState(null);
  const [filter,    setFilter]    = useState("all");

  const load = () => inquiryAPI.getAll().then(r => { setInquiries(r.data.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const open = async (inq) => {
    setSelected(inq);
    if (inq.status === "New") { await inquiryAPI.updateStatus(inq._id,"Read"); load(); }
  };

  const del = async (id) => {
    if (!confirm("Delete this inquiry?")) return;
    await inquiryAPI.remove(id);
    setToast({ msg:"Inquiry deleted" }); load();
  };

  const unread = inquiries.filter(i=>i.status==="New").length;
  const filtered = filter==="all" ? inquiries : inquiries.filter(i=>i.type===filter);

  if (loading) return <AdminLayout title="Inquiries"><Spinner /></AdminLayout>;

  return (
    <AdminLayout title="Inquiries">
      <div className="flex justify-between items-center mb-24">
        <div>
          <div style={{ fontFamily:"var(--font-cond)",fontSize:11,letterSpacing:3,color:"var(--orange)",textTransform:"uppercase" }}>Client Module</div>
          <div style={{ fontFamily:"var(--font-display)",fontSize:26,letterSpacing:2 }}>Inquiries & Quotations</div>
        </div>
        {unread>0 && <span className="badge badge-orange">{unread} Unread</span>}
      </div>
      <div className="tabs">
        {[["all","All"],["contact","Contact"],["quotation","Quotations"]].map(([v,l])=>(
          <button key={v} className={`tab-btn ${filter===v?"active":""}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>From</th><th>Subject</th><th>Type</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(inq => (
                <tr key={inq._id} style={{ opacity:inq.status!=="New"?.8:1,fontWeight:inq.status==="New"?700:400 }}>
                  <td><div style={{ fontFamily:"var(--font-cond)",fontWeight:700 }}>{inq.name}</div><div style={{ fontSize:12,color:"var(--text-muted)" }}>{inq.email}</div></td>
                  <td style={{ fontFamily:"var(--font-cond)",fontSize:14 }}>{inq.subject}</td>
                  <td><span className={`badge ${inq.type==="quotation"?"badge-blue":"badge-gray"}`}>{inq.type}</span></td>
                  <td style={{ fontSize:12,color:"var(--text-muted)" }}>{new Date(inq.createdAt).toLocaleDateString()}</td>
                  <td><StatusBadge status={inq.status} /></td>
                  <td><div className="flex gap-8"><Btn variant="ghost" size="sm" onClick={() => open(inq)}>View</Btn><Btn variant="danger" size="sm" onClick={() => del(inq._id)}>Del</Btn></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <Modal title="Inquiry Details" onClose={() => setSelected(null)}
          footer={<Btn onClick={() => setSelected(null)}>Close</Btn>}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16 }}>
            {[["From",selected.name],["Email",selected.email],["Phone",selected.phone||"—"],["Type",selected.type],["Subject",selected.subject],["Date",new Date(selected.createdAt).toLocaleDateString()]].map(([l,v])=>(
              <div key={l}><div className="form-label">{l}</div><div style={{ marginTop:4,fontSize:14 }}>{v}</div></div>
            ))}
          </div>
          {selected.projectType && <div style={{ marginBottom:12 }}><div className="form-label">Project Type</div><div style={{ marginTop:4,fontSize:14 }}>{selected.projectType}</div></div>}
          {selected.budget && <div style={{ marginBottom:12 }}><div className="form-label">Budget Range</div><div style={{ marginTop:4,fontSize:14,color:"var(--orange)" }}>{selected.budget}</div></div>}
          <div className="form-label">Message</div>
          <div style={{ marginTop:8,background:"var(--bg)",padding:14,borderRadius:8,border:"1px solid var(--border)",fontSize:14,lineHeight:1.6,color:"var(--text-dim)" }}>{selected.message}</div>
        </Modal>
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </AdminLayout>
  );
}
