import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { workerAPI, attendanceAPI } from "../../api/services";
import { Btn, Toast, Spinner, fmtCurrency, getToday } from "../../components/ui";

const STATUS_CYCLE = ["Present", "Absent", "Half Day", "Leave"];
const STATUS_STYLE = {
  "Present":  { bg:"rgba(34,197,94,.12)",   color:"var(--green)",      border:"rgba(34,197,94,.3)" },
  "Absent":   { bg:"rgba(239,68,68,.12)",   color:"var(--red)",        border:"rgba(239,68,68,.3)" },
  "Half Day": { bg:"rgba(251,191,36,.12)",  color:"var(--yellow)",     border:"rgba(251,191,36,.3)" },
  "Leave":    { bg:"rgba(139,148,158,.1)",  color:"var(--text-muted)", border:"rgba(139,148,158,.2)" },
};

export default function AttendancePage() {
  const [workers,    setWorkers]    = useState([]);
  const [attMap,     setAttMap]     = useState({});  // { workerId: status }
  const [attIdMap,   setAttIdMap]   = useState({});  // for display only
  const [date,       setDate]       = useState(getToday());
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState(null);

  const loadWorkers = async () => {
    const w = await workerAPI.getAll();
    setWorkers(w.data.data);
  };

  const loadAttendance = async (d) => {
    const a = await attendanceAPI.getByDate(d);
    const map = {}, idMap = {};
    a.data.data.forEach(r => { map[r.worker._id] = r.status; idMap[r.worker._id] = r._id; });
    setAttMap(map);
    setAttIdMap(idMap);
  };

  useEffect(() => { loadWorkers(); }, []);
  useEffect(() => { if (workers.length) loadAttendance(date).finally(() => setLoading(false)); }, [date, workers.length]);

  const markOne = async (workerId, status) => {
    setAttMap(m => ({ ...m, [workerId]: status }));
    try { await attendanceAPI.mark({ worker: workerId, date, status }); }
    catch { setToast({ msg: "Failed to save", type: "error" }); }
  };

  const markAll = async (status) => {
    const newMap = {};
    workers.forEach(w => { newMap[w._id] = status; });
    setAttMap(newMap);
    await attendanceAPI.markBulk({ date, status });
    setToast({ msg: `All marked as ${status}` });
  };

  const counts = STATUS_CYCLE.reduce((acc, s) => {
    acc[s] = workers.filter(w => attMap[w._id] === s).length;
    return acc;
  }, {});

  if (loading) return <AdminLayout title="Attendance"><Spinner /></AdminLayout>;

  return (
    <AdminLayout title="Attendance">
      <div className="flex justify-between items-center mb-24">
        <div>
          <div style={{ fontFamily:"var(--font-cond)",fontSize:11,letterSpacing:3,color:"var(--orange)",textTransform:"uppercase" }}>Daily Tracking</div>
          <div style={{ fontFamily:"var(--font-display)",fontSize:26,letterSpacing:2 }}>Attendance Register</div>
        </div>
        <div className="flex items-center gap-12">
          <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width:"auto" }} />
          <Btn variant="ghost" size="sm" onClick={() => markAll("Present")}>All Present</Btn>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24 }}>
        {STATUS_CYCLE.map(s => {
          const st = STATUS_STYLE[s];
          return (
            <div key={s} className="card" style={{ borderTop:`3px solid ${st.color}` }}>
              <div className="card-body" style={{ padding:"14px 18px" }}>
                <div style={{ fontFamily:"var(--font-display)",fontSize:36,color:st.color }}>{counts[s]}</div>
                <div style={{ fontFamily:"var(--font-cond)",fontSize:11,letterSpacing:2,color:"var(--text-muted)",textTransform:"uppercase" }}>{s}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Mark Attendance — {date}</span>
          <span style={{ fontSize:12,color:"var(--text-muted)" }}>{workers.length} workers</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Worker</th><th>Role</th><th>Daily Wage</th><th>Current Status</th><th>Mark As</th></tr></thead>
            <tbody>
              {workers.map(w => {
                const current = attMap[w._id] || null;
                return (
                  <tr key={w._id}>
                    <td>
                      <div className="flex items-center gap-8">
                        <div style={{ width:34,height:34,borderRadius:"50%",background:"var(--orange-glow)",border:"1px solid var(--orange)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-display)",color:"var(--orange)",flexShrink:0 }}>{w.name[0]}</div>
                        <span style={{ fontFamily:"var(--font-cond)",fontWeight:700 }}>{w.name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{w.role}</span></td>
                    <td style={{ fontFamily:"var(--font-display)",fontSize:18,color:"var(--orange)" }}>{fmtCurrency(w.dailyWage)}</td>
                    <td>
                      {current ? (
                        <span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"4px 12px",borderRadius:6,background:STATUS_STYLE[current].bg,color:STATUS_STYLE[current].color,border:`1px solid ${STATUS_STYLE[current].border}`,fontFamily:"var(--font-cond)",fontSize:12,fontWeight:700,letterSpacing:1 }}>
                          {current}
                        </span>
                      ) : <span className="badge badge-gray">Not Marked</span>}
                    </td>
                    <td>
                      <div className="flex gap-8">
                        {STATUS_CYCLE.map(s => (
                          <button key={s} onClick={() => markOne(w._id, s)}
                            style={{ padding:"4px 10px",borderRadius:6,background:STATUS_STYLE[s].bg,color:STATUS_STYLE[s].color,border:`1px solid ${STATUS_STYLE[s].border}`,fontFamily:"var(--font-cond)",fontSize:11,fontWeight:700,cursor:"pointer",opacity:current===s?1:.45,transition:"opacity .15s" }}>
                            {s === "Half Day" ? "½ Day" : s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </AdminLayout>
  );
}
