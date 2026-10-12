import { Link } from 'react-router';
import formatDate from '../utils/formatDate';

function PostCard({ post }) {
  const preview = post.content.length > 140 ? post.content.slice(0, 140) + '...' : post.content;

  return (
    <article className="card">
      <h2><Link to={`/posts/${post._id}`}>{post.title}</Link></h2>
      <p className="meta">By @{post.author?.username} · {formatDate(post.createdAt)}</p>
      <p className="excerpt">{preview}</p>
      <div className="tags">
        {post.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
      </div>
      <Link to={`/posts/${post._id}`} className="read-more">Read more →</Link>
    </article>
  );
}

export default PostCard;
