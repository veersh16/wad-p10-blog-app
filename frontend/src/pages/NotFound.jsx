import { Link } from 'react-router';

function NotFound() {
  return (
    <div className="empty">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="btn">Go Home</Link>
    </div>
  );
}

export default NotFound;
