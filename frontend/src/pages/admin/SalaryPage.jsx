import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { salaryAPI } from "../../api/services";
import { Btn, Toast, Spinner, fmtCurrency, getMonth, StatusBadge } from "../../components/ui";

export default function SalaryPage() {
  const [records,  setRecords]  = useState([]);
  const [meta,     setMeta]     = useState({ totalPayroll: 0, totalPaid: 0 });
  const [month,    setMonth]    = useState(getMonth());
  const [loading,  setLoading]  = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [toast,    setToast]    = useState(null);

  const load = async (m) => {
    setLoading(true);
    try {
      const r = await salaryAPI.getByMonth(m);
      setRecords(r.data.data);
      setMeta({ totalPayroll: r.data.totalPayroll, totalPaid: r.data.totalPaid });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(month); }, [month]);

  const generate = async () => {
    setGenLoading(true);
    try {
      await salaryAPI.generate(month);
      setToast({ msg: "Salary generated from attendance records" });
      load(month);
    } catch { setToast({ msg: "Error generating salary", type: "error" }); }
    finally { setGenLoading(false); }
  };

  const togglePay = async (r) => {
    try {
      if (r.paymentStatus === "Paid") { await salaryAPI.markUnpaid(r._id); setToast({ msg: "Marked as pending" }); }
      else                            { await salaryAPI.markPaid(r._id);   setToast({ msg: `Salary paid to ${r.worker?.name}` }); }
      load(month);
    } catch { setToast({ msg: "Error updating payment", type: "error" }); }
  };

  const paid    = records.filter(r => r.paymentStatus === "Paid").length;
  const pending = records.length - paid;

  return (
    <AdminLayout title="Salary">
      <div className="flex justify-between items-center mb-24">
        <div>
          <div style={{ fontFamily:"var(--font-cond)",fontSize:11,letterSpacing:3,color:"var(--orange)",textTransform:"uppercase" }}>Finance Module</div>
          <div style={{ fontFamily:"var(--font-display)",fontSize:26,letterSpacing:2 }}>Salary Management</div>
        </div>
        <div className="flex items-center gap-12">
          <input className="form-input" type="month" value={month} onChange={e => setMonth(e.target.value)} style={{ width:"auto" }} />
          <Btn onClick={generate} disabled={genLoading}>{genLoading ? "Generating…" : "Generate from Attendance"}</Btn>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24 }}>
        <div className="card"><div className="card-body" style={{ padding:"16px 20px" }}><div style={{ fontFamily:"var(--font-display)",fontSize:28,color:"var(--orange)" }}>{fmtCurrency(meta.totalPayroll)}</div><div style={{ fontFamily:"var(--font-cond)",fontSize:11,letterSpacing:2,color:"var(--text-muted)",textTransform:"uppercase",marginTop:4 }}>Total Payroll</div></div></div>
        <div className="card"><div className="card-body" style={{ padding:"16px 20px" }}><div style={{ fontFamily:"var(--font-display)",fontSize:28,color:"var(--green)" }}>{paid}</div><div style={{ fontFamily:"var(--font-cond)",fontSize:11,letterSpacing:2,color:"var(--text-muted)",textTransform:"uppercase",marginTop:4 }}>Paid Workers</div></div></div>
        <div className="card"><div className="card-body" style={{ padding:"16px 20px" }}><div style={{ fontFamily:"var(--font-display)",fontSize:28,color:"var(--yellow)" }}>{pending}</div><div style={{ fontFamily:"var(--font-cond)",fontSize:11,letterSpacing:2,color:"var(--text-muted)",textTransform:"uppercase",marginTop:4 }}>Pending Workers</div></div></div>
      </div>

      {loading ? <Spinner /> : records.length === 0 ? (
        <div className="card"><div className="card-body" style={{ textAlign:"center",padding:"48px",color:"var(--text-muted)" }}>
          <div style={{ fontSize:32,marginBottom:12 }}>💰</div>
          <div style={{ fontFamily:"var(--font-cond)",fontSize:16,letterSpacing:1 }}>No salary records for {month}</div>
          <div style={{ marginTop:8,fontSize:13 }}>Click "Generate from Attendance" to calculate salaries</div>
        </div></div>
      ) : (
        <div className="card">
          <div className="card-header"><span className="card-title">Salary Report — {month}</span></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Worker</th><th>Role</th><th>Daily Wage</th><th>Present</th><th>Half Day</th><th>Gross Salary</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {records.map(r => (
                  <tr key={r._id}>
                    <td>
                      <div className="flex items-center gap-8">
                        <div style={{ width:34,height:34,borderRadius:"50%",background:"var(--orange-glow)",border:"1px solid var(--orange)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-display)",color:"var(--orange)",flexShrink:0 }}>{r.worker?.name?.[0]||"?"}</div>
                        <div><div style={{ fontFamily:"var(--font-cond)",fontWeight:700 }}>{r.worker?.name}</div><div style={{ fontSize:12,color:"var(--text-muted)" }}>{r.worker?.phone}</div></div>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{r.worker?.role}</span></td>
                    <td style={{ fontFamily:"var(--font-display)",fontSize:18,color:"var(--text-dim)" }}>{fmtCurrency(r.dailyWage)}</td>
                    <td><div style={{ textAlign:"center" }}><div style={{ fontFamily:"var(--font-display)",fontSize:24,color:r.daysPresent>20?"var(--green)":r.daysPresent>10?"var(--orange)":"var(--red)" }}>{r.daysPresent}</div><div style={{ fontSize:11,color:"var(--text-muted)" }}>days</div></div></td>
                    <td><div style={{ textAlign:"center" }}><div style={{ fontFamily:"var(--font-display)",fontSize:20,color:"var(--yellow)" }}>{r.daysHalfDay}</div><div style={{ fontSize:11,color:"var(--text-muted)" }}>days</div></div></td>
                    <td style={{ fontFamily:"var(--font-display)",fontSize:22,color:"var(--yellow)" }}>{fmtCurrency(r.grossSalary)}</td>
                    <td><StatusBadge status={r.paymentStatus} /></td>
                    <td><Btn variant={r.paymentStatus==="Paid"?"ghost":"primary"} size="sm" onClick={() => togglePay(r)}>{r.paymentStatus==="Paid"?"Undo":"Pay Now"}</Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </AdminLayout>
  );
}
