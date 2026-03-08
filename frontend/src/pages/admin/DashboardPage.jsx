import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { projectAPI, workerAPI, attendanceAPI, inquiryAPI } from "../../api/services";
import { fmtCurrency, getToday, StatusBadge, ProgressBar, Spinner } from "../../components/ui";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function DashboardPage() {
  const [stats,    setStats]    = useState(null);
  const [projects, setProjects] = useState([]);
  const [workers,  setWorkers]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      projectAPI.getAll(),
      workerAPI.getAll(),
      attendanceAPI.getByDate(getToday()),
      inquiryAPI.getAll({ status: "New" }),
    ]).then(([p, w, a, i]) => {
      setProjects(p.data.data);
      setWorkers(w.data.data);
      const att = a.data.data;
      setStats({
        projects:   p.data.count,
        workers:    w.data.count,
        present:    att.filter(x => x.status === "Present").length,
        inquiries:  i.data.unreadCount,
        completed:  p.data.data.filter(x => x.status === "Completed").length,
        totalWage:  w.data.data.reduce((s, x) => s + x.dailyWage * 26, 0),
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><Spinner /></AdminLayout>;

  const chartData = [
    { name:"Jan",v:45 },{ name:"Feb",v:62 },{ name:"Mar",v:38 },{ name:"Apr",v:71 },
    { name:"May",v:55 },{ name:"Jun",v:80 },{ name:"Jul",v:67 },{ name:"Aug",v:74 },
    { name:"Sep",v:58 },{ name:"Oct",v:88 },{ name:"Nov",v:72 },{ name:"Dec",v:65 },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stat Cards */}
      <div className="grid-4 mb-24">
        {[
          { label: "Total Projects",  val: stats.projects,  color: "var(--orange)", sub: `${stats.completed} completed` },
          { label: "Workers",         val: stats.workers,   color: "var(--blue)",   sub: "Registered staff" },
          { label: "Present Today",   val: stats.present,   color: "var(--green)",  sub: `of ${stats.workers} workers` },
          { label: "New Inquiries",   val: stats.inquiries, color: "var(--purple)", sub: "Unread messages" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontFamily: "var(--font-cond)", fontSize: 10, letterSpacing: 2, color: "var(--text-muted)", textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 44, color: s.color, lineHeight: 1, margin: "8px 0 4px" }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-24">
        {/* Active Projects */}
        <div className="card">
          <div className="card-header"><span className="card-title">Active Projects</span></div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {projects.filter(p => p.status !== "Completed").slice(0, 4).map(p => (
              <div key={p._id}>
                <div className="flex justify-between items-center mb-8">
                  <span style={{ fontFamily: "var(--font-cond)", fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--orange)" }}>{p.completion}%</span>
                </div>
                <ProgressBar value={p.completion} green={p.completion === 100} />
                <div className="flex justify-between mt-16" style={{ marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.location}</span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="card">
          <div className="card-header"><span className="card-title">Attendance Trend</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={14}>
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-cond)" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontFamily: "var(--font-cond)", fontSize: 12 }} />
                <Bar dataKey="v" radius={[3,3,0,0]}>
                  {chartData.map((e, i) => <Cell key={i} fill={e.v > 70 ? "var(--green)" : "var(--orange)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="divider"></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-dim)" }}>
              <span>Monthly Payroll</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--orange)" }}>{fmtCurrency(stats.totalWage)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Workers */}
      <div className="card">
        <div className="card-header"><span className="card-title">Recent Workers</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>Project</th><th>Daily Wage</th><th>Joined</th></tr></thead>
            <tbody>
              {workers.slice(0, 5).map(w => (
                <tr key={w._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--orange-glow)", border: "1px solid var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 16, color: "var(--orange)", flexShrink: 0 }}>{w.name[0]}</div>
                      <div><div style={{ fontFamily: "var(--font-cond)", fontWeight: 700 }}>{w.name}</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>{w.email}</div></div>
                    </div>
                  </td>
                  <td><StatusBadge status={w.role} /></td>
                  <td style={{ fontSize: 13, color: "var(--text-dim)" }}>{w.project?.name || "—"}</td>
                  <td style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--orange)" }}>{fmtCurrency(w.dailyWage)}</td>
                  <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{w.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
