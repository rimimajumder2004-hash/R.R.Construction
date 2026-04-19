import { useState, useEffect } from "react";
import { projectAPI, galleryAPI, inquiryAPI } from "../../api/services";
import { Spinner } from "../../components/ui";

const pubCSS = `
.pub-nav { position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,11,13,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:62px; }
.pub-logo-text { font-family:var(--font-display);font-size:20px;letter-spacing:2px; }
.pub-nav-links { display:flex;gap:24px; }
.pub-nav-btn { font-family:var(--font-cond);font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-dim);cursor:pointer;transition:color .2s;border:none;background:none; }
.pub-nav-btn:hover,.pub-nav-btn.active { color:var(--orange); }
.hero { min-height:100vh;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:100px 24px 60px; }
.hero-bg { position:absolute;inset:0;background-image:linear-gradient(rgba(10,11,13,.85),rgba(10,11,13,.6) 50%,rgba(10,11,13,.95)),url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&fit=crop');background-size:cover;background-position:center; }
.hero-eyebrow { font-family:var(--font-cond);font-size:12px;letter-spacing:4px;text-transform:uppercase;color:var(--orange);margin-bottom:16px; }
.hero-h1 { font-family:var(--font-display);font-size:clamp(52px,8vw,96px);letter-spacing:4px;line-height:.95;margin-bottom:20px; }
.hero-h1 span { color:var(--orange); }
.hero-desc { font-size:17px;color:var(--text-dim);max-width:500px;margin:0 auto 36px;line-height:1.65; }
.hero-cta { display:flex;gap:12px;justify-content:center;flex-wrap:wrap; }
.stats-strip { background:var(--orange);padding:22px 40px;display:flex;justify-content:space-around;flex-wrap:wrap;gap:16px; }
.stat-num { font-family:var(--font-display);font-size:34px;color:#fff;letter-spacing:2px; }
.stat-lbl { font-family:var(--font-cond);font-size:11px;color:rgba(255,255,255,.8);letter-spacing:2px;text-transform:uppercase; }
.pub-section { padding:70px 40px;max-width:1100px;margin:0 auto; }
.sec-eyebrow { font-family:var(--font-cond);font-size:11px;letter-spacing:4px;color:var(--orange);text-transform:uppercase;margin-bottom:8px; }
.sec-title { font-family:var(--font-display);font-size:clamp(30px,4vw,50px);letter-spacing:2px;margin-bottom:14px; }
.sec-desc { color:var(--text-dim);max-width:480px;line-height:1.6;margin-bottom:44px;font-size:15px; }
.service-card { background:var(--card);border:1px solid var(--border);border-radius:12px;padding:26px;transition:all .25s;cursor:pointer; }
.service-card:hover { border-color:var(--orange);transform:translateY(-4px);box-shadow:0 16px 40px rgba(249,115,22,.1); }
.svc-icon { width:46px;height:46px;background:var(--orange-glow);border:1px solid rgba(249,115,22,.3);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px; }
.svc-name { font-family:var(--font-cond);font-size:17px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px; }
.svc-desc { font-size:14px;color:var(--text-dim);line-height:1.5; }
.gallery-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:14px; }
.gal-item { position:relative;border-radius:10px;overflow:hidden;aspect-ratio:16/11; }
.gal-item img { width:100%;height:100%;object-fit:cover;transition:transform .4s; }
.gal-item:hover img { transform:scale(1.06); }
.gal-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 55%);opacity:0;transition:opacity .3s;display:flex;align-items:flex-end;padding:14px; }
.gal-item:hover .gal-overlay { opacity:1; }
.gal-title { font-family:var(--font-cond);font-size:14px;font-weight:700;letter-spacing:1px; }
.pub-footer { background:var(--surface);border-top:1px solid var(--border);padding:24px 40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;margin-top:40px; }
.quote-box { background:linear-gradient(135deg,var(--card),#1a1f28);border:1px solid var(--border);border-radius:14px;padding:36px; }
.pub-btn { display:inline-flex;align-items:center;gap:8px;padding:12px 26px;border-radius:8px;font-family:var(--font-cond);font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;transition:all .2s; }
.pub-btn-primary { background:var(--orange);color:#fff; }
.pub-btn-primary:hover { background:var(--orange-dim); }
.pub-btn-ghost { background:transparent;color:var(--text-dim);border:1px solid var(--border); }
.pub-btn-ghost:hover { border-color:var(--orange);color:var(--orange); }
@media(max-width:768px) {
  .pub-nav { padding:0 16px; }
  .pub-section { padding:50px 16px; }
  .gallery-grid { grid-template-columns:1fr 1fr; }
}
`;

let pubStyled = false;
const injectPubStyles = () => {
  if (pubStyled) return;
  const s = document.createElement("style");
  s.textContent = pubCSS;
  document.head.appendChild(s);
  pubStyled = true;
};

const SECTIONS = [
  "home",
  "services",
  "projects",
  "gallery",
  "quote",
  "contact",
];

export default function PublicSite() {
  const [section, setSection] = useState("home");
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    injectPubStyles();
    Promise.all([projectAPI.getAll(), galleryAPI.getPublic()])
      .then(([p, g]) => {
        setProjects(p.data.data);
        setGallery(g.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner />
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* NAV */}
      <nav className="pub-nav">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
          onClick={() => setSection("home")}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "var(--orange)",
              clipPath: "polygon(0 100%,50% 0,100% 100%)",
            }}
          ></div>
          <span className="pub-logo-text">R.R.CONSTRUCTION</span>
        </div>
        <div className="pub-nav-links">
          {SECTIONS.map((s) => (
            <button
              key={s}
              className={`pub-nav-btn ${section === s ? "active" : ""}`}
              onClick={() => setSection(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* HOME */}
      {section === "home" && (
        <>
          <div className="hero">
            <div className="hero-bg"></div>
            <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
              <div className="hero-eyebrow">
                Est. 2016 · Ankleshwar, Gujarat
              </div>
              <h1 className="hero-h1">
                BUILD
                <br />
                <span>BEYOND</span>
                <br />
                LIMITS
              </h1>
              <p className="hero-desc">
                Gujarat's most trusted construction company. From foundations to
                finishing, we deliver excellence on every project.
              </p>
              <div className="hero-cta">
                <button
                  className="pub-btn pub-btn-primary"
                  style={{ padding: "14px 32px", fontSize: 14 }}
                  onClick={() => setSection("quote")}
                >
                  Get a Free Quote
                </button>
                <button
                  className="pub-btn pub-btn-ghost"
                  style={{ padding: "14px 32px", fontSize: 14 }}
                  onClick={() => setSection("projects")}
                >
                  View Portfolio
                </button>
              </div>
            </div>
          </div>
          <div className="stats-strip">
            {[
              ["15+", "Years Experience"],
              ["200+", "Projects Completed"],
              ["500+", "Skilled Workers"],
              ["₹500Cr+", "Projects Delivered"],
            ].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div className="stat-num">{n}</div>
                <div className="stat-lbl">{l}</div>
              </div>
            ))}
          </div>
          <div className="pub-section">
            <div className="sec-eyebrow">What We Do</div>
            <div className="sec-title">Our Services</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 18,
              }}
            >
              {[
                [
                  "🏢",
                  "Commercial Construction",
                  "Office buildings, malls, and industrial facilities built to code.",
                ],
                [
                  "🏠",
                  "Residential Projects",
                  "Luxury villas, apartments, and housing colonies across Maharashtra.",
                ],
                [
                  "🌉",
                  "Infrastructure Works",
                  "Bridges, flyovers, road construction, and municipal infrastructure.",
                ],
                [
                  "📋",
                  "Project Consultancy",
                  "End-to-end planning, budgeting, permits, and site supervision.",
                ],
                [
                  "🔧",
                  "Interior Finishing",
                  "Premium interiors, flooring, electrical, plumbing and finishing.",
                ],
                [
                  "🦺",
                  "Safety & Compliance",
                  "ISO-compliant audits, inspections, and certification management.",
                ],
              ].map(([icon, name, desc]) => (
                <div key={name} className="service-card">
                  <div className="svc-icon">{icon}</div>
                  <div className="svc-name">{name}</div>
                  <div className="svc-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* SERVICES */}
      {section === "services" && (
        <div className="pub-section" style={{ paddingTop: 100 }}>
          <div className="sec-eyebrow">What We Offer</div>
          <div className="sec-title">Our Services</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 18,
            }}
          >
            {[
              [
                "🏢",
                "Commercial Construction",
                "Office buildings, malls, and industrial facilities built to code and deadline.",
              ],
              [
                "🏠",
                "Residential Projects",
                "Luxury villas, apartment complexes, and housing colonies across Maharashtra.",
              ],
              [
                "🌉",
                "Infrastructure Works",
                "Bridges, flyovers, road construction, and municipal infrastructure projects.",
              ],
              [
                "📋",
                "Project Consultancy",
                "End-to-end project planning, budgeting, permits, and site supervision.",
              ],
              [
                "🔧",
                "Interior Finishing",
                "Premium interiors, flooring, electrical, plumbing, and finishing works.",
              ],
              [
                "🦺",
                "Safety & Compliance",
                "ISO-compliant safety audits, inspections, and certification management.",
              ],
            ].map(([icon, name, desc]) => (
              <div key={name} className="service-card">
                <div className="svc-icon">{icon}</div>
                <div className="svc-name">{name}</div>
                <div className="svc-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROJECTS */}
      {section === "projects" && (
        <div className="pub-section" style={{ paddingTop: 100 }}>
          <div className="sec-eyebrow">Portfolio</div>
          <div className="sec-title">Our Projects</div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
          >
            {projects.map((p) => (
              <div key={p._id} className="card">
                <div style={{ height: 6, background: "var(--border)" }}>
                  <div
                    style={{
                      height: "100%",
                      background:
                        p.status === "Completed"
                          ? "var(--green)"
                          : "var(--orange)",
                      width: `${p.completion}%`,
                    }}
                  ></div>
                </div>
                <div className="card-body">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 22,
                        letterSpacing: 1,
                      }}
                    >
                      {p.name}
                    </div>
                    <span
                      className={`badge badge-${p.status === "Completed" ? "green" : p.status === "In Progress" ? "orange" : "blue"}`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      marginBottom: 10,
                    }}
                  >
                    📍 {p.location}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "var(--text-dim)",
                      lineHeight: 1.5,
                      marginBottom: 14,
                    }}
                  >
                    {p.description}
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Started: {p.startDate}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        color: "var(--orange)",
                      }}
                    >
                      {p.completion}% done
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GALLERY */}
      {section === "gallery" && (
        <div className="pub-section" style={{ paddingTop: 100 }}>
          <div className="sec-eyebrow">Visual Portfolio</div>
          <div className="sec-title">Site Gallery</div>
          <div className="gallery-grid">
            {gallery.map((img) => (
              <div key={img._id} className="gal-item">
                <img src={img.imageUrl} alt={img.title} />
                <div className="gal-overlay">
                  <div>
                    <div className="gal-title">{img.title}</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,.7)",
                        marginTop: 2,
                      }}
                    >
                      {img.project?.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUOTE */}
      {section === "quote" && (
        <div className="pub-section" style={{ paddingTop: 100, maxWidth: 680 }}>
          <div className="sec-eyebrow">Free Consultation</div>
          <div className="sec-title">Request a Quote</div>
          <QuoteForm />
        </div>
      )}

      {/* CONTACT */}
      {section === "contact" && (
        <div className="pub-section" style={{ paddingTop: 100 }}>
          <div className="sec-eyebrow">Get in Touch</div>
          <div className="sec-title">Contact Us</div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}
          >
            <div>
              {[
                [
                  "📍 Address",
                  "A/4 Umiya Nagar ,\nAnkleshwar, Gujarat — 393001",
                ],
                ["📞 Phone", "+91 9924514506\n+91 9313645281"],
                ["📧 Email", "rrconstructionprojects2016@gmail.com"],
                ["🕐 Hours", "Mon – Sat: 9:00 AM – 7:00 PM"],
              ].map(([lbl, val]) => (
                <div key={lbl} style={{ marginBottom: 22 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-cond)",
                      fontSize: 11,
                      letterSpacing: 2,
                      color: "var(--orange)",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    {lbl}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "var(--text-dim)",
                      whiteSpace: "pre-line",
                      lineHeight: 1.6,
                    }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <ContactForm />
          </div>
        </div>
      )}

      <footer className="pub-footer">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: "var(--orange)",
              clipPath: "polygon(0 100%,50% 0,100% 100%)",
            }}
          ></div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                letterSpacing: 2,
              }}
            >
              R.R.CONSTRUCTION
            </div>
            <div
              style={{
                fontFamily: "var(--font-cond)",
                fontSize: 9,
                color: "var(--text-muted)",
                letterSpacing: 3,
              }}
            >
              CONSTRUCTION & INFRASTRUCTURE
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          © 2025 R.R.CONSTRUCTION Pvt. Ltd. All rights reserved
        </div>
      </footer>
    </div>
  );
}

// ── Quote Form ─────────────────────────────────────────────────────────────
function QuoteForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    try {
      await inquiryAPI.submit({
        ...form,
        type: "quotation",
        subject: form.projectType || "Quote Request",
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted)
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>✅</div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            letterSpacing: 2,
            color: "var(--green)",
            marginBottom: 10,
          }}
        >
          QUOTE SUBMITTED!
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Our team will contact you within 24 hours.
        </div>
        <button
          className="pub-btn pub-btn-primary"
          style={{ marginTop: 24 }}
          onClick={() => {
            setSubmitted(false);
            setForm({
              name: "",
              email: "",
              phone: "",
              projectType: "",
              budget: "",
              message: "",
            });
          }}
        >
          Submit Another
        </button>
      </div>
    );

  return (
    <div className="quote-box">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        {[
          ["Your Name *", "name", "text"],
          ["Email Address *", "email", "email"],
          ["Phone", "phone", "tel"],
          ["Project Type", "projectType", "text"],
        ].map(([lbl, key, type]) => (
          <div key={key} className="form-group">
            <label className="form-label">{lbl}</label>
            <input
              className="form-input"
              type={type}
              value={form[key]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
            />
          </div>
        ))}
        <div className="form-group" style={{ gridColumn: "1/-1" }}>
          <label className="form-label">Estimated Budget</label>
          <select
            className="form-select"
            value={form.budget}
            onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
          >
            <option value="">Select range</option>
            {["₹10L – ₹50L", "₹50L – ₹1Cr", "₹1Cr – ₹5Cr", "₹5Cr+"].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ gridColumn: "1/-1" }}>
          <label className="form-label">Project Details *</label>
          <textarea
            className="form-textarea"
            value={form.message}
            onChange={(e) =>
              setForm((f) => ({ ...f, message: e.target.value }))
            }
            placeholder="Describe your project requirements..."
            style={{ minHeight: 100 }}
          />
        </div>
      </div>
      <button
        className="pub-btn pub-btn-primary"
        style={{ width: "100%", justifyContent: "center", padding: "13px" }}
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Submitting…" : "Submit Quote Request"}
      </button>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email) return;
    setLoading(true);
    try {
      await inquiryAPI.submit({
        ...form,
        type: "contact",
        subject: "Contact Inquiry",
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent)
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>📨</div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            letterSpacing: 2,
            color: "var(--green)",
          }}
        >
          MESSAGE SENT!
        </div>
        <div style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 13 }}>
          We'll respond within 1 business day.
        </div>
      </div>
    );

  return (
    <div className="card">
      <div
        className="card-body"
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        {[
          ["Your Name", "name", "text"],
          ["Email", "email", "email"],
        ].map(([lbl, key, type]) => (
          <div key={key} className="form-group">
            <label className="form-label">{lbl}</label>
            <input
              className="form-input"
              type={type}
              value={form[key]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
            />
          </div>
        ))}
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea
            className="form-textarea"
            value={form.message}
            onChange={(e) =>
              setForm((f) => ({ ...f, message: e.target.value }))
            }
            placeholder="How can we help?"
          />
        </div>
        <button
          className="pub-btn pub-btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Sending…" : "Send Message"}
        </button>
      </div>
    </div>
  );
}
