import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import api, { errorMessage } from '../api/axiosConfig';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

function PostForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const showToast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api.get(`/posts/${id}`)
      .then(res => setForm({ title: res.data.title, content: res.data.content, tags: res.data.tags.join(', ') }))
      .catch(err => {
        showToast(errorMessage(err), 'error');
        navigate('/');
      })
      .finally(() => setLoading(false));
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = id ? await api.put(`/posts/${id}`, form) : await api.post('/posts', form);
      showToast(id ? 'Post updated' : 'Post published');
      navigate(`/posts/${data._id}`);
    } catch (err) {
      showToast(errorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="form-card wide">
      <h1>{id ? 'Edit Post' : 'New Post'}</h1>
      <form onSubmit={handleSubmit}>
        <label>Title<input name="title" value={form.title} onChange={handleChange} minLength="3" required /></label>
        <label>Content<textarea name="content" value={form.content} onChange={handleChange} rows="8" required /></label>
        <label>Tags <span className="muted">(comma separated)</span>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="react, node" />
        </label>
        <div className="actions">
          <button className="btn" disabled={saving}>{saving ? 'Saving...' : id ? 'Save Changes' : 'Publish'}</button>
          <Link to={id ? `/posts/${id}` : '/'} className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
