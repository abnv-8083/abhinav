import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

// Restore native cursor on admin — global CSS sets cursor:none for the portfolio
function useAdminCursor() {
  useEffect(() => {
    const prev = document.body.style.cursor;
    document.body.style.cursor = 'default';
    document.documentElement.style.cursor = 'default';
    // Also inject a quick override style so * doesn't inherit none
    const style = document.createElement('style');
    style.id = 'admin-cursor-override';
    style.textContent = '*, *::before, *::after { cursor: auto !important; } button, a, [role="button"] { cursor: pointer !important; }';
    document.head.appendChild(style);
    return () => {
      document.body.style.cursor = prev;
      document.documentElement.style.cursor = '';
      document.getElementById('admin-cursor-override')?.remove();
    };
  }, []);
}

/* ─────────────────────────────────────────────────────────
   Tiny shared UI primitives
───────────────────────────────────────────────────────── */
const Input = ({ label, ...props }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: '#888' }}>
    {label}
    <input
      {...props}
      style={{
        background: '#111', border: '1px solid #222', borderRadius: '0.5rem',
        padding: '0.6rem 0.9rem', color: '#eee', fontSize: '0.85rem', outline: 'none',
        transition: 'border-color 0.2s', width: '100%', boxSizing: 'border-box',
        ...props.style,
      }}
      onFocus={e => (e.target.style.borderColor = '#c8ff00')}
      onBlur={e => (e.target.style.borderColor = '#222')}
    />
  </label>
);

const Textarea = ({ label, rows = 3, ...props }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: '#888' }}>
    {label}
    <textarea
      rows={rows}
      {...props}
      style={{
        background: '#111', border: '1px solid #222', borderRadius: '0.5rem',
        padding: '0.6rem 0.9rem', color: '#eee', fontSize: '0.85rem', outline: 'none',
        resize: 'vertical', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
        transition: 'border-color 0.2s',
        ...props.style,
      }}
      onFocus={e => (e.target.style.borderColor = '#c8ff00')}
      onBlur={e => (e.target.style.borderColor = '#222')}
    />
  </label>
);

const Btn = ({ children, variant = 'primary', ...props }) => {
  const styles = {
    primary:  { background: '#c8ff00', color: '#080808' },
    danger:   { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
    ghost:    { background: 'transparent', color: '#888', border: '1px solid #222' },
  };
  return (
    <button
      {...props}
      style={{
        padding: '0.5rem 1.1rem', borderRadius: '0.5rem', fontWeight: 600,
        fontSize: '0.75rem', letterSpacing: '0.05em', cursor: 'pointer',
        border: 'none', transition: 'opacity 0.2s', ...styles[variant], ...props.style,
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {children}
    </button>
  );
};

const Card = ({ children, style }) => (
  <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '1rem', padding: '1.5rem', ...style }}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#eeebe4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
    {children}
  </h2>
);

const Tag = ({ text, onRemove }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.6rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '100px', fontSize: '0.7rem', color: '#aaa' }}>
    {text}
    {onRemove && <button onClick={onRemove} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>}
  </span>
);

const StatusMsg = ({ msg, type }) => msg ? (
  <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', marginBottom: '1rem',
    background: type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(200,255,0,0.08)',
    border: `1px solid ${type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(200,255,0,0.2)'}`,
    color: type === 'error' ? '#ef4444' : '#c8ff00' }}>
    {msg}
  </div>
) : null;

/* ─────────────────────────────────────────────────────────
   Image uploader
───────────────────────────────────────────────────────── */
function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true); setErr('');
    try {
      const { url } = await api.admin.uploadImage(file);
      onChange(url);
    } catch (e) {
      setErr(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <span style={{ fontSize: '0.75rem', color: '#888' }}>Image</span>
      <div
        onClick={() => document.getElementById('img-upload-input').click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
        style={{
          border: '2px dashed #2a2a2a', borderRadius: '0.75rem', padding: '1.5rem',
          textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s',
          ...(value ? { borderColor: 'rgba(200,255,0,0.3)' } : {}),
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#c8ff00')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = value ? 'rgba(200,255,0,0.3)' : '#2a2a2a')}
      >
        {uploading ? (
          <span style={{ color: '#666', fontSize: '0.8rem' }}>Uploading…</span>
        ) : value ? (
          <img src={value} alt="preview" style={{ maxHeight: '120px', borderRadius: '0.5rem', objectFit: 'cover' }} />
        ) : (
          <span style={{ color: '#444', fontSize: '0.8rem' }}>Drop image or click to upload</span>
        )}
      </div>
      <input id="img-upload-input" type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])} />
      {value && (
        <Input label="Image URL" value={value} onChange={e => onChange(e.target.value)} />
      )}
      {err && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{err}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Projects section
───────────────────────────────────────────────────────── */
function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [status, setStatus] = useState({ msg: '', type: '' });
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try { setProjects(await api.projects()); } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const blank = () => ({
    slug: '', title: '', subtitle: '', description: '', problem: '', solution: '',
    features: [], tech: [], year: '', role: '', github: '', live: '',
    image: '', color: '#c8ff00', accentColor: 'rgba(200,255,0,0.1)',
    bgGradient: '', featured: false, order: projects.length + 1,
  });

  const startNew  = () => { setForm(blank()); setEditing('new'); setStatus({ msg: '', type: '' }); };
  const startEdit = (p) => { setForm({ ...p }); setEditing(p._id); setStatus({ msg: '', type: '' }); };
  const cancel    = () => { setEditing(null); setForm({}); };

  const save = async () => {
    setLoading(true); setStatus({ msg: '', type: '' });
    try {
      if (editing === 'new') await api.admin.createProject(form);
      else await api.admin.updateProject(editing, form);
      setStatus({ msg: 'Saved ✓', type: 'ok' });
      await load(); cancel();
    } catch (e) {
      setStatus({ msg: e.message, type: 'error' });
    } finally { setLoading(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await api.admin.deleteProject(id); await load(); }
    catch (e) { alert(e.message); }
  };

  const setArr = (key, raw) => setForm(f => ({ ...f, [key]: raw.split(',').map(s => s.trim()).filter(Boolean) }));

  if (editing !== null) return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Btn variant="ghost" onClick={cancel}>← Back</Btn>
        <h3 style={{ color: '#eeebe4', fontWeight: 600 }}>{editing === 'new' ? 'New Project' : 'Edit Project'}</h3>
      </div>
      <StatusMsg {...status} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input label="Slug *" value={form.slug || ''} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
        <Input label="Title *" value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <Input label="Subtitle" value={form.subtitle || ''} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
        <Input label="Year" value={form.year || ''} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
        <Input label="Role" value={form.role || ''} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
        <Input label="Order" type="number" value={form.order || 0} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} />
        <Input label="GitHub URL" value={form.github || ''} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} />
        <Input label="Live URL" value={form.live || ''} onChange={e => setForm(f => ({ ...f, live: e.target.value }))} />
        <Input label="Accent Color" value={form.color || ''} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
        <Input label="Accent BG" value={form.accentColor || ''} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))} />
        <div style={{ gridColumn: '1/-1' }}>
          <Textarea label="Description" rows={3} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <Textarea label="Problem" rows={2} value={form.problem || ''} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <Textarea label="Solution" rows={2} value={form.solution || ''} onChange={e => setForm(f => ({ ...f, solution: e.target.value }))} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <Input label="Tech stack (comma-separated)" value={(form.tech || []).join(', ')} onChange={e => setArr('tech', e.target.value)} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <Input label="Features (comma-separated)" value={(form.features || []).join(', ')} onChange={e => setArr('features', e.target.value)} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <Input label="BG Gradient CSS" value={form.bgGradient || ''} onChange={e => setForm(f => ({ ...f, bgGradient: e.target.value }))} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <ImageUploader value={form.image || ''} onChange={url => setForm(f => ({ ...f, image: url }))} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Btn onClick={save} disabled={loading}>{loading ? 'Saving…' : 'Save Project'}</Btn>
        <Btn variant="ghost" onClick={cancel}>Cancel</Btn>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <SectionTitle>Projects</SectionTitle>
        <Btn onClick={startNew}>+ New Project</Btn>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {projects.map(p => (
          <Card key={p._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {p.image && <img src={p.image} alt="" style={{ width: 48, height: 48, borderRadius: '0.5rem', objectFit: 'cover' }} />}
              <div>
                <div style={{ color: '#eeebe4', fontWeight: 600, fontSize: '0.9rem' }}>{p.title}</div>
                <div style={{ color: '#555', fontSize: '0.75rem' }}>{p.year} · {p.slug}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Btn variant="ghost" onClick={() => startEdit(p)}>Edit</Btn>
              <Btn variant="danger" onClick={() => del(p._id)}>Delete</Btn>
            </div>
          </Card>
        ))}
        {!projects.length && <p style={{ color: '#444', fontSize: '0.85rem' }}>No projects yet.</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Skills section
───────────────────────────────────────────────────────── */
function SkillsSection() {
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [status, setStatus] = useState({ msg: '', type: '' });

  const load = useCallback(async () => {
    try { setCats(await api.skills()); } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const blank = () => ({ category: '', order: cats.length + 1, items: [] });
  const startNew  = () => { setForm(blank()); setEditing('new'); };
  const startEdit = (c) => { setForm({ ...c, items: [...c.items] }); setEditing(c._id); };
  const cancel    = () => { setEditing(null); setForm({}); };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { name: '', level: 80, desc: '' }] }));
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i, key, val) => setForm(f => {
    const items = [...f.items];
    items[i] = { ...items[i], [key]: key === 'level' ? +val : val };
    return { ...f, items };
  });

  const save = async () => {
    try {
      if (editing === 'new') await api.admin.createSkillCat(form);
      else await api.admin.updateSkillCat(editing, form);
      setStatus({ msg: 'Saved ✓', type: 'ok' });
      await load(); cancel();
    } catch (e) { setStatus({ msg: e.message, type: 'error' }); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try { await api.admin.deleteSkillCat(id); await load(); } catch (e) { alert(e.message); }
  };

  if (editing !== null) return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Btn variant="ghost" onClick={cancel}>← Back</Btn>
        <h3 style={{ color: '#eeebe4', fontWeight: 600 }}>{editing === 'new' ? 'New Category' : 'Edit Category'}</h3>
      </div>
      <StatusMsg {...status} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <Input label="Category name" value={form.category || ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
        <Input label="Order" type="number" value={form.order || 0} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#888' }}>Skills</span>
          <Btn variant="ghost" onClick={addItem} style={{ fontSize: '0.7rem', padding: '0.3rem 0.75rem' }}>+ Add Skill</Btn>
        </div>
        {(form.items || []).map((item, i) => (
          <Card key={i} style={{ marginBottom: '0.5rem', padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
              <Input label="Name" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} />
              <Input label="Level %" type="number" min={0} max={100} value={item.level} onChange={e => updateItem(i, 'level', e.target.value)} style={{ width: '80px' }} />
              <Input label="Description" value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} />
              <Btn variant="danger" onClick={() => removeItem(i)} style={{ marginBottom: '0.1rem' }}>✕</Btn>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Btn onClick={save}>Save Category</Btn>
        <Btn variant="ghost" onClick={cancel}>Cancel</Btn>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <SectionTitle>Skills</SectionTitle>
        <Btn onClick={startNew}>+ New Category</Btn>
      </div>
      {cats.map(c => (
        <Card key={c._id} style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#eeebe4', fontWeight: 600, fontSize: '0.9rem' }}>{c.category}</div>
            <div style={{ color: '#555', fontSize: '0.75rem' }}>{c.items.length} skills</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Btn variant="ghost" onClick={() => startEdit(c)}>Edit</Btn>
            <Btn variant="danger" onClick={() => del(c._id)}>Delete</Btn>
          </div>
        </Card>
      ))}
      {!cats.length && <p style={{ color: '#444', fontSize: '0.85rem' }}>No skill categories yet.</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Experience section
───────────────────────────────────────────────────────── */
function ExperienceSection() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [status, setStatus] = useState({ msg: '', type: '' });

  const load = useCallback(async () => {
    try { setItems(await api.experience()); } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const blank = () => ({ year: '', title: '', role: '', description: '', highlights: [], type: 'growth', order: items.length + 1 });
  const startNew  = () => { setForm(blank()); setEditing('new'); };
  const startEdit = (e) => { setForm({ ...e }); setEditing(e._id); };
  const cancel    = () => { setEditing(null); setForm({}); };

  const save = async () => {
    try {
      if (editing === 'new') await api.admin.createExp(form);
      else await api.admin.updateExp(editing, form);
      setStatus({ msg: 'Saved ✓', type: 'ok' });
      await load(); cancel();
    } catch (e) { setStatus({ msg: e.message, type: 'error' }); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await api.admin.deleteExp(id); await load(); } catch (e) { alert(e.message); }
  };

  if (editing !== null) return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Btn variant="ghost" onClick={cancel}>← Back</Btn>
        <h3 style={{ color: '#eeebe4', fontWeight: 600 }}>Experience Entry</h3>
      </div>
      <StatusMsg {...status} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input label="Year" value={form.year || ''} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
        <Input label="Title" value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <Input label="Role" value={form.role || ''} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
        <div>
          <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '0.35rem' }}>Type</label>
          <select value={form.type || 'growth'} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            style={{ background: '#111', border: '1px solid #222', borderRadius: '0.5rem', padding: '0.6rem 0.9rem', color: '#eee', fontSize: '0.85rem', width: '100%' }}>
            {['learning','growth','milestone','current'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <Input label="Order" type="number" value={form.order || 0} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} />
        <div style={{ gridColumn: '1/-1' }}>
          <Textarea label="Description" rows={3} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <Input label="Highlights (comma-separated)" value={(form.highlights || []).join(', ')} onChange={e => setForm(f => ({ ...f, highlights: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Btn onClick={save}>Save</Btn>
        <Btn variant="ghost" onClick={cancel}>Cancel</Btn>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <SectionTitle>Experience</SectionTitle>
        <Btn onClick={startNew}>+ New Entry</Btn>
      </div>
      {items.map(e => (
        <Card key={e._id} style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#eeebe4', fontWeight: 600, fontSize: '0.9rem' }}>{e.year} — {e.title}</div>
            <div style={{ color: '#555', fontSize: '0.75rem' }}>{e.role} · <span style={{ color: '#c8ff00' }}>{e.type}</span></div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Btn variant="ghost" onClick={() => startEdit(e)}>Edit</Btn>
            <Btn variant="danger" onClick={() => del(e._id)}>Delete</Btn>
          </div>
        </Card>
      ))}
      {!items.length && <p style={{ color: '#444', fontSize: '0.85rem' }}>No experience entries yet.</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   About section
───────────────────────────────────────────────────────── */
function AboutSection() {
  const [form, setForm] = useState({});
  const [status, setStatus] = useState({ msg: '', type: '' });

  useEffect(() => {
    api.about().then(setForm).catch(() => {});
  }, []);

  const save = async () => {
    try {
      await api.admin.updateAbout(form);
      setStatus({ msg: 'Saved ✓', type: 'ok' });
    } catch (e) { setStatus({ msg: e.message, type: 'error' }); }
  };

  const f = (key) => ({ value: form[key] || '', onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  return (
    <div>
      <SectionTitle>About</SectionTitle>
      <StatusMsg {...status} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input label="Name" {...f('name')} />
        <Input label="Headline" {...f('headline')} />
        <Input label="Location" {...f('location')} />
        <Input label="Focus" {...f('focus')} />
        <Input label="Status" {...f('status')} />
        <div>
          <label style={{ fontSize: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input type="checkbox" checked={!!form.available} onChange={e => setForm(p => ({ ...p, available: e.target.checked }))} />
            Available for work
          </label>
        </div>
        <Input label="Resume URL" {...f('resumeUrl')} />
        <div style={{ gridColumn: '1/-1' }}>
          <Textarea label="Bio" rows={4} {...f('bio')} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <ImageUploader value={form.avatar || ''} onChange={url => setForm(p => ({ ...p, avatar: url }))} />
        </div>
      </div>
      <Btn onClick={save} style={{ marginTop: '1.5rem' }}>Save About</Btn>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Social Links section
───────────────────────────────────────────────────────── */
function SocialLinksSection() {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({ platform: '', label: '', href: '', value: '', icon: 'Globe', order: 1 });
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState({ msg: '', type: '' });

  const load = useCallback(async () => {
    try { setLinks(await api.socialLinks()); } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const startEdit = (l) => { setForm({ ...l }); setEditId(l._id); };
  const cancel    = () => { setForm({ platform: '', label: '', href: '', value: '', icon: 'Globe', order: 1 }); setEditId(null); };

  const save = async () => {
    try {
      if (editId) await api.admin.updateLink(editId, form);
      else await api.admin.createLink(form);
      setStatus({ msg: 'Saved ✓', type: 'ok' });
      await load(); cancel();
    } catch (e) { setStatus({ msg: e.message, type: 'error' }); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await api.admin.deleteLink(id); await load(); } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <SectionTitle>Social Links</SectionTitle>
      <StatusMsg {...status} />
      <Card style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ color: '#eeebe4', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>{editId ? 'Edit Link' : 'Add Link'}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Input label="Platform" value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))} />
          <Input label="Label" value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} />
          <Input label="URL (href)" value={form.href} onChange={e => setForm(p => ({ ...p, href: e.target.value }))} />
          <Input label="Display value" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} />
          <Input label="Icon name (Lucide)" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} />
          <Input label="Order" type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: +e.target.value }))} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <Btn onClick={save}>Save Link</Btn>
          {editId && <Btn variant="ghost" onClick={cancel}>Cancel</Btn>}
        </div>
      </Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map(l => (
          <Card key={l._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem' }}>
            <div>
              <span style={{ color: '#eeebe4', fontWeight: 600, fontSize: '0.85rem' }}>{l.platform}</span>
              <span style={{ color: '#555', fontSize: '0.75rem', marginLeft: '0.75rem' }}>{l.href}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Btn variant="ghost" onClick={() => startEdit(l)}>Edit</Btn>
              <Btn variant="danger" onClick={() => del(l._id)}>Delete</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Admin page
───────────────────────────────────────────────────────── */
const SECTIONS = ['Projects', 'Skills', 'Experience', 'About', 'Social Links'];

export default function Admin() {
  useAdminCursor(); // restore native cursor — portfolio CSS hides it globally
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('admin_token'));
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [section, setSection] = useState('Projects');

  const login = async (e) => {
    e.preventDefault();
    try {
      // Validate password by hitting a protected endpoint
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pw}` },
        body: JSON.stringify({}),
      });
      if (res.status === 401) throw new Error('Wrong password');
      sessionStorage.setItem('admin_token', pw);
      setAuthed(true);
    } catch (e) {
      setPwErr(e.message);
    }
  };

  const logout = () => { sessionStorage.removeItem('admin_token'); setAuthed(false); };

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={login} style={{ width: '100%', maxWidth: '360px', padding: '2rem' }}>
        <h1 style={{ color: '#eeebe4', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Admin</h1>
        <p style={{ color: '#444', fontSize: '0.85rem', marginBottom: '2rem' }}>Portfolio CMS</p>
        {pwErr && <StatusMsg msg={pwErr} type="error" />}
        <div style={{ marginBottom: '1rem' }}>
          <Input label="Password" type="password" value={pw} onChange={e => { setPw(e.target.value); setPwErr(''); }} autoFocus />
        </div>
        <Btn type="submit" style={{ width: '100%' }}>Sign in</Btn>
      </form>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, borderRight: '1px solid #111', padding: '2rem 1.25rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ color: '#c8ff00', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Admin</div>
          <div style={{ color: '#444', fontSize: '0.7rem', marginTop: '0.25rem' }}>Portfolio CMS</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setSection(s)}
              style={{
                textAlign: 'left', background: section === s ? 'rgba(200,255,0,0.08)' : 'transparent',
                border: 'none', borderRadius: '0.5rem', padding: '0.65rem 0.875rem',
                color: section === s ? '#c8ff00' : '#666', fontSize: '0.82rem', fontWeight: section === s ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (section !== s) e.target.style.color = '#aaa'; }}
              onMouseLeave={e => { if (section !== s) e.target.style.color = '#666'; }}
            >
              {s}
            </button>
          ))}
        </nav>
        <button onClick={logout}
          style={{ background: 'transparent', border: '1px solid #1a1a1a', borderRadius: '0.5rem', padding: '0.5rem 0.875rem', color: '#444', fontSize: '0.75rem', cursor: 'pointer', marginTop: 'auto' }}>
          Sign out
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', maxWidth: '900px' }}>
        {section === 'Projects'     && <ProjectsSection />}
        {section === 'Skills'       && <SkillsSection />}
        {section === 'Experience'   && <ExperienceSection />}
        {section === 'About'        && <AboutSection />}
        {section === 'Social Links' && <SocialLinksSection />}
      </main>
    </div>
  );
}
