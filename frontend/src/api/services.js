import api from "./axios";

// ── Auth ───────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};
// ── Projects ───────────────────────────────────────────────────────────────
export const projectAPI = {
  getAll: () => api.get("/projects"),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  remove: (id) => api.delete(`/projects/${id}`),
};

// ── Workers ────────────────────────────────────────────────────────────────
export const workerAPI = {
  getAll: (params) => api.get("/workers", { params }),
  getOne: (id) => api.get(`/workers/${id}`),
  create: (data) => api.post("/workers", data),
  update: (id, data) => api.put(`/workers/${id}`, data),
  remove: (id) => api.delete(`/workers/${id}`),
};

// ── Attendance ─────────────────────────────────────────────────────────────
export const attendanceAPI = {
  getByDate: (date) => api.get("/attendance", { params: { date } }),
  getByWorker: (id, month) =>
    api.get(`/attendance/worker/${id}`, { params: { month } }),
  getSummary: (month) => api.get("/attendance/summary", { params: { month } }),
  mark: (data) => api.post("/attendance", data),
  markBulk: (data) => api.post("/attendance/bulk", data),
};

// ── Salary ─────────────────────────────────────────────────────────────────
export const salaryAPI = {
  getByMonth: (month) => api.get("/salary", { params: { month } }),
  generate: (month) => api.post("/salary/generate", { month }),
  markPaid: (id) => api.put(`/salary/${id}/pay`),
  markUnpaid: (id) => api.put(`/salary/${id}/unpay`),
};

// ── Gallery ────────────────────────────────────────────────────────────────
export const galleryAPI = {
  getPublic: () => api.get("/gallery"),
  getAll: () => api.get("/gallery/all"),
  create: (data) => api.post("/gallery", data),
  remove: (id) => api.delete(`/gallery/${id}`),
};

// ── Inquiries ──────────────────────────────────────────────────────────────
export const inquiryAPI = {
  submit: (data) => api.post("/inquiries", data),
  getAll: (params) => api.get("/inquiries", { params }),
  updateStatus: (id, status) => api.put(`/inquiries/${id}`, { status }),
  remove: (id) => api.delete(`/inquiries/${id}`),
};
