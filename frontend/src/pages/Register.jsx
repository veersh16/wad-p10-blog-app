import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import api, { errorMessage } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user);
      showToast('Account created');
      navigate('/');
    } catch (err) {
      showToast(errorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-card">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>Username<input name="username" value={form.username} onChange={handleChange} required /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={handleChange} required /></label>
        <label>Password<input type="password" name="password" value={form.password} onChange={handleChange} minLength="6" required /></label>
        <button className="btn full" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
      </form>
      <p className="muted">Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Register;
