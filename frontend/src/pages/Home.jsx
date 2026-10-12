import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api, { errorMessage } from '../api/axiosConfig';
import PostCard from '../components/PostCard';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => {
        setFailed(true);
        showToast(errorMessage(err), 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  if (failed) {
    return (
      <div className="empty">
        <p>Could not load posts. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <h1>Latest Posts</h1>
      {posts.length === 0 ? (
        <div className="empty">
          <p>No posts yet.</p>
          <Link to="/create" className="btn">Write the first post</Link>
        </div>
      ) : (
        <div className="grid">
          {posts.map(post => <PostCard key={post._id} post={post} />)}
        </div>
      )}
    </>
  );
}

export default Home;
