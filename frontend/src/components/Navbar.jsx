import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Navbar() {
  const { user, logout } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    showToast('Logged out');
    navigate('/');
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">WAD Blog</Link>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        {user ? (
          <>
            <NavLink to="/create">New Post</NavLink>
            <span className="user">@{user.username}</span>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
