import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import api, { errorMessage } from '../api/axiosConfig';
import CommentBox from '../components/CommentBox';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import formatDate from '../utils/formatDate';
import NotFound from './NotFound';

function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get(`/posts/${id}`), api.get(`/posts/${id}/comments`)])
      .then(([postRes, commentRes]) => {
        setPost(postRes.data);
        setComments(commentRes.data);
      })
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
        else showToast(errorMessage(err), 'error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      showToast('Post deleted');
      navigate('/');
    } catch (err) {
      showToast(errorMessage(err), 'error');
    }
  }

  if (loading) return <Spinner />;
  if (notFound) return <NotFound />;
  if (!post) return <div className="empty"><p>Could not load this post.</p></div>;

  const isAuthor = user?.id === post.author?._id;

  return (
    <article className="post-detail">
      <Link to="/" className="back">← All posts</Link>
      <h1>{post.title}</h1>
      <p className="meta">By @{post.author?.username} · {formatDate(post.createdAt)}</p>
      <div className="tags">
        {post.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
      </div>
      <div className="content">{post.content}</div>
      {isAuthor && (
        <div className="actions">
          <Link to={`/edit/${post._id}`} className="btn">Edit</Link>
          <button className="btn btn-outline" onClick={handleDelete}>Delete</button>
        </div>
      )}
      <section className="comments">
        <h2>Comments ({comments.length})</h2>
        {comments.length === 0 && <p className="muted">No comments yet.</p>}
        {comments.map(c => (
          <div key={c._id} className="comment">
            <p className="meta"><b>@{c.author?.username}</b> · {formatDate(c.createdAt)}</p>
            <p>{c.text}</p>
          </div>
        ))}
        {user ? (
          <CommentBox postId={id} onAdded={c => setComments(prev => [...prev, c])} />
        ) : (
          <p className="notice"><Link to="/login" state={{ from: `/posts/${id}` }}>Login</Link> to comment.</p>
        )}
      </section>
    </article>
  );
}

export default PostDetail;
