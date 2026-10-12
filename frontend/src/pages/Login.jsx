import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import api, { errorMessage } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      showToast(`Welcome back, ${data.user.username}!`);
      navigate(location.state?.from || '/');
    } catch (err) {
      showToast(errorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-card">
      <h1>Login</h1>
      {location.state?.message && <p className="notice">{location.state.message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email<input type="email" name="email" value={form.email} onChange={handleChange} required /></label>
        <label>Password<input type="password" name="password" value={form.password} onChange={handleChange} required /></label>
        <button className="btn full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="muted">No account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;
