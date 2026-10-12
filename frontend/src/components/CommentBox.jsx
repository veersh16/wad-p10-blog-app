import { useState } from 'react';
import api, { errorMessage } from '../api/axiosConfig';
import { useToast } from '../context/ToastContext';

function CommentBox({ postId, onAdded }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const showToast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { text });
      onAdded(data);
      setText('');
      showToast('Comment added');
    } catch (err) {
      showToast(errorMessage(err), 'error');
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="comment-box" onSubmit={handleSubmit}>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write a comment..." rows="3" required />
      <button className="btn" disabled={sending}>{sending ? 'Posting...' : 'Post Comment'}</button>
    </form>
  );
}

export default CommentBox;
